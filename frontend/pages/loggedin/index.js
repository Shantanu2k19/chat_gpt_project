import React, { useRef, useState, useEffect, Component } from "react";
import "../../styles/loggedin.css";
import ChatHistory from "./ChatHistory.js";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import styled from "styled-components";
import Header from "./Header.js";
import useSpeechSynthesis from "./voiceHelper/T2Shelper";
import useSpeechRecognition from './voiceHelper/S2Thelper';
import SettingPopup from "./SettingsPopup";
const cookies = new Cookies();

export default function LandingPage() {
  console.log("langing page entered");
  let theme = "dark";
  const [userName, setUserName] = React.useState("user");
  const [userPic, setUserPic] = React.useState("_");

  //FOR DARK MODE
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleState = () => {
    setIsEnabled((prevState) => !prevState);
  };

  const updateTheme = (isDarkEnabled) => {
    // Get all available styles
    const styles = getComputedStyle(document.body);

    // Get the --black and --white variable values
    const black = styles.getPropertyValue("--black");
    const white = styles.getPropertyValue("--white");
    const grayL = styles.getPropertyValue("--grey");
    const grayD = styles.getPropertyValue("--darkGrey");
    const gptL = styles.getPropertyValue("--gptColorLight");
    const gptD = styles.getPropertyValue("--gptColorDark");

    const docEl = document.documentElement;

    if (isDarkEnabled) {
      docEl.style.setProperty("--backgroundSB", black);
      docEl.style.setProperty("--foregroundSB", white);
      docEl.style.setProperty("--hoverColor", grayD);

      docEl.style.setProperty("--background", black);
      docEl.style.setProperty("--foreground", white);

      docEl.style.setProperty("--contentBG", gptD);
    } else {
      docEl.style.setProperty("--backgroundSB", white);
      docEl.style.setProperty("--foregroundSB", black);
      docEl.style.setProperty("--hoverColor", grayL);

      docEl.style.setProperty("--background", white);
      docEl.style.setProperty("--foreground", black);

      docEl.style.setProperty("--contentBG", gptL);
    }
  };

  useEffect(() => {
    // Pass in the isEnabled state
    isEnabled ? (theme = "dark") : (theme = "light");
    updateTheme(isEnabled);
  }, [isEnabled]);

  function showAlert(mssg, val) {
    if (val == 0) {
      toast.info(mssg, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
      });
      return;
    }

    toast.error(mssg, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  }

  //AUTHORIZING
  let router = useRouter();

  useEffect(() => {
    // console.log("authorizing...");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");

    if (!cAccToken) {
      // window.location.assign("/error");
      router.push("/error");
    }

    setUserName(cookies.get("userName"));
    if (cookies.get("userPic") !== undefined)
      setUserPic(cookies.get("userPic"));
  });

  //LOGOUT HANDLER
  const logoutUser = async () => {
    console.log("logging out");

    const token = cookies.get("refreshToken");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    cookies.remove("userName");
    cookies.remove("userPic");

    router.push("/");

    const response = await fetch("http://localhost:5000/users/logout", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      console.log("logout success");
    } else {
      console.log("server issue in logout, check");
    }
  };

  //ASK QUESTION AND ADD TO HISTORY TAB AREA
  const [newQuestions, setnewQuestions] = React.useState([]);
  const [needHistory, setneedHistory] = React.useState(true);
  const [tempQuestion, setTempQuestion] = React.useState(false);
  const [tempQuestionVal, setTempQuestionVal] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // console.log("needHistory :", needHistory);

  const handleSubmit = async (e) => {
    // console.log("question submitted");
    e.preventDefault();
    setTempQuestionVal(e.target.ques.value);

    const question = e.target.ques.value;

    if (question.length <= 1) {
      showAlert("Ask better question for meaningful responses :)", 0);
      return;
    }

    setTempQuestion(true);
    e.target.ques.value = "";
    // console.log(question);

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(
      "http://localhost:5000/users/question_to_gpt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cAccToken}`,
        },
        body: JSON.stringify({ question, reftoken }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      // console.log(json.answer);
      const ans = json.answer;
      setnewQuestions((prevItem) => [...prevItem, question, ans]);
    } else {
      console.log("cant get bugData");
    }
    // console.log("updated");

    setTempQuestion(false);
  };

  //CLEAR CONVERSATION
  const clearConversation = async () => {
    setConfirmDelete(false);

    console.log("clearing conversation");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch("http://localhost:5000/users/clearChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cAccToken}`,
      },
      body: JSON.stringify({ reftoken }),
    });
    const json = await response.json();

    if (response.ok) {
      showAlert("clearing conversation", 0);
      // console.log("Clear chat success");
      setnewQuestions([]);
      setneedHistory(false);
      // clearConversation(false);
    } else {
      showAlert(json.message, 1);
      // console.log(json.message);
    }
  };

  //FOR SCROLLING TO BOTTOM
  const messagesEndRef = useRef(null);

  const scrollBottom = async (e) => {
    console.log("scroll to bottom");

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollBottom();
  });

  //FOR SHOWING THE BUTTON : SCROLL TO BOTTOM

  const [showButton, setShowButton] = React.useState(true);

  const listInnerRef = useRef();

  const onScroll = () => {
    // console.log("listener");
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // console.log('Reached bottom')
        setShowButton(false);
      } else {
        // console.log('top')
        setShowButton(true);
      }
    }
  };

  function proMode() {
    showAlert("Pro mode gives faster responses. Coming soon!", 0);
  }

  function myAccount() {
    showAlert("Hi, cutie", 0);
  }

  //NEW CHANGES

  const MyComponent = styled.div`
    display: none;

    @media (max-width: 620px) {
      display: inline;
    }
  `;

  //sidebar using react
  const [sidebarOpen, setSideBarOpen] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState(0);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // console.log("starting page");
    setScreenWidth(window.innerWidth);

    if (screenWidth <= 620) {
      setSideBarOpen(false);
    } else {
      setSideBarOpen(true);
    }
  }, [screenWidth]);

  const toggleSidebar = () => {
    setSideBarOpen(!sidebarOpen);
  };

  const closeSidebarFromContent = () => {
    if (sidebarOpen) setSideBarOpen(false);
  };


  //BUG POPUP 
  const [bugPopEnabled, setBugPopEnabled] = React.useState(false);
  const [bugData, setBugData] = React.useState("");

  function toggleBugPopup() {
    setBugPopEnabled(!bugPopEnabled);
  }

  const reportedBug = async (e) => {
    console.log("reporting bug");

    if(bugData.length <= 1){
      showAlert("Express more :)", 0);
      return;
    }

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(
      "http://localhost:5000/users/reportBug",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cAccToken}`,
        },
        body: JSON.stringify({ bugData, reftoken }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      showAlert("Thanks for letting us know :)", 0);
    } else {
      showAlert(json.message, 1);
    }
    setBugData("")
    toggleBugPopup();
  }


  //FOR SETINGS POPUP 
  const [stnPopup, setStnPopup] = React.useState(false);

  // const [text, setText] = useState('hello boy ');

  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(1);

  const [isGoogleVoice, setIsGoogleVoice] = useState(false);

  const onEnd = () => {
    // You could do something here after speaking has finished
    console.log("ENDDDD")
  };
  
  
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  const voice = voices[voiceIndex] || 3;

  function speakNow(){
    console.log("speaking");
    setTimeout(() => {console.log("done")}, 1000); 

    speak({ text, voice, rate, pitch });

     {/* {prop.speaking ? (
              <button type="button" onClick={cancel}>
                Stop
              </button>
            ) : (
              <button type="button" onClick={prop.speakNow}>
                Speak
              </button>
            )} */}

    return;
  }

  function testSpeach(){
    const text = "this is a test audio";
    
    speak({ text, voice, rate, pitch });
  }

  function closePopups(){
    setBugPopEnabled(false);
    setStnPopup(false);
  }










  //FOR SPEECH TO TEXT
  const [lang, setLang] = useState('en-AU');
  const [value, setValue] = useState('');
  const [blocked, setBlocked] = useState(false);

  // const onEnd = () => {
  //   // You could do something here after listening has finished
  // };

  const onResult = (result) => {
    setValue(result);
  };

  const changeLang = (event) => {
    setLang(event.target.value);
  };

  const onError = (event) => {
    if (event.error === 'not-allowed') {
      setBlocked(true);
    }
  };

  const { listen, listening, stop, supportedS2T } = useSpeechRecognition({
    onResult,
    onEnd,
    onError,
  });

  const toggle = listening
    ? stop
    : () => {
        setBlocked(false);
        listen({ lang });
      };




      //GET PREFERENCE OF USER 
      const getPrefs = async () => {
  
        console.log("get pref");
    
        const cookies = new Cookies();
        const cAccToken = cookies.get("accessToken");
        const reftoken = cookies.get("refreshToken");
    
        const response = await fetch("http://localhost:5000/users/get_prefs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cAccToken}`,
          },
          body: JSON.stringify({ reftoken }),
        });
        const json = await response.json();
    
        if (response.ok) {
          console.log("get pref success");

          setVoiceIndex(json.data[0]["voice"])
          setPitch(json.data[0]["pitch"])
          setRate(json.data[0]["rate"])
          setIsGoogleVoice(json.data[0]["gnable"])
       } else {
          showAlert(json.message, 1);
        }
      };

      React.useEffect( () => {
        getPrefs();
      }, []) 



      //SET PREFERENCE OF USER 
      const setPrefs = async () => {
        console.log("get pref");
    
        const cookies = new Cookies();
        const cAccToken = cookies.get("accessToken");
        const reftoken = cookies.get("refreshToken");

        const newPrefs = {
          "gnable": isGoogleVoice,
          "voice": voiceIndex==""?3:voiceIndex,
          "rate":rate,
          "pitch":pitch,
        }
        const response = await fetch("http://localhost:5000/users/set_prefs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cAccToken}`,
          },
          body: JSON.stringify({ reftoken, newPrefs }),
        });
        const json = await response.json();
    
        if (response.ok) {
          console.log("set pref success");
          showAlert("Preference set.", 0);
       } else {
          showAlert(json.message, 1);
        }
      };

   
  //RETURN DIV
  return (
    <div className="home">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme={theme}
      />

      {bugPopEnabled  &&  (<div className="overlay2" onClick={closePopups}> </div>)}
      {stnPopup  &&  (<div className="overlay2" onClick={closePopups}> </div>)}

      {/* SIDEBAR  */}
      <>
        <div
          className="globalDiv"
          style={bugPopEnabled ? { top: "120px" } : { top: "-100px" }}
        >
            <div className="bugForm">
              <div className="bugInsideDiv">
                <strong>Report bug/ Request feature</strong>
                <input
                  className="bugInput"
                  type="text"
                  placeholder="...."
                  // name="review"
                  value={bugData}
                  onChange={(e) => setBugData(e.target.value)}
                />
              </div>
            </div>

              <div className="submitButtons">
                <button className="button-17" onClick={reportedBug}>Submit</button>
                <div style={{ width: "33px" }}></div>
                <button className="button-17" onClick={toggleBugPopup}>
                  Close
                </button>
              </div>

        </div>

        <SettingPopup 
          supported = {supported}
          stnPopup = {stnPopup}

          pitch = {pitch}
          setPitch = {setPitch}

          rate = {rate}
          setRate = {setRate}

          voices = {voices}
          voiceIndex = {voiceIndex}
          setVoiceIndex = {setVoiceIndex}

          isGoogleVoice = {isGoogleVoice}
          setIsGoogleVoice ={setIsGoogleVoice}

          speakNow = {speakNow}

          testSpeach = {testSpeach}

          setPrefs = {setPrefs}
        />

        <div
          className="sidebar"
          style={
            screenWidth <= 620
              ? sidebarOpen
                ? { left: "0px", position: "absolute" }
                : { left: "-212px", position: "absolute" }
              : sidebarOpen
              ? { left: "0px", position: "static" }
              : { left: "-212px", position: "static" }
          }
        >
          <div className="sidebar--content" onClick={myAccount}>
            <div className="my-account">
              <img
                alt="user-img"
                src={
                  userPic != "_"
                    ? userPic
                    : isEnabled
                    ? "/images/loggedin/user_d.png"
                    : "/images/loggedin/user_l.png"
                }
                className="sidebar-image-2"
              />
              <br />
              <span className="sidebar-text">{userName}</span>
            </div>
          </div>

          {/* switch theme  */}
          <div className="sidebar--content">
            <br />

            <label className="toggle-wrapper" htmlFor="toggle">
              <div className={`toggle ${isEnabled ? "enabled" : "disabled"}`}>
                <div className="icons">
                  <img className="iconkk" src="/images/loggedin/sun.png"></img>
                  <img className="iconkk" src="/images/loggedin/moon.png"></img>
                  {/* <MoonIcon /> */}
                </div>
                <input
                  id="toggle"
                  name="toggle"
                  type="checkbox"
                  checked={isEnabled}
                  onClick={toggleState}
                />
              </div>
            </label>
          </div>

          <div style={{ flexGrow: "1" }}></div>

          <hr style={{ width: "90%", color: "rgba(255, 255, 255, 0.226)" }} />

          <div className="sidebar--content" onClick={getPrefs}>
            <a>
              <img
                alt="delete-img"
                src={
                  isEnabled
                    ? "/images/loggedin/pro_d.png"
                    : "/images/loggedin/pro_l.png"
                }
                className="sidebar-image"
              />
              <span className="sidebar-text">Pro mode</span>
            </a>
          </div>

          <div className="sidebar--content" onClick={() => setStnPopup(!stnPopup)}>
            <a>
              <img
                alt="delete-img"
                src={
                  isEnabled
                    ? "/images/loggedin/mic.png"
                    : "/images/loggedin/mic_l.png"
                }
                className="sidebar-image"
              />
              <span className="sidebar-text">Voice Settings</span>
            </a>
          </div>

          {!confirmDelete && (
            <div
              className="sidebar--content"
              onClick={() => setConfirmDelete(true)}
            >
              <a>
                <img
                  alt="delete-img"
                  src={
                    isEnabled
                      ? "/images/loggedin/delete.png"
                      : "/images/loggedin/delete_l.png"
                  }
                  className="sidebar-image"
                />
                <span className="sidebar-text">Clear conversation</span>
              </a>
            </div>
          )}

          {confirmDelete && (
            <div className="sidebar--content" onClick={clearConversation}>
              <a>
                <img
                  alt="delete-img"
                  src={
                    isEnabled
                      ? "/images/loggedin/clear.png"
                      : "/images/loggedin/clear_l.png"
                  }
                  className="sidebar-image"
                />
                <span className="sidebar-text">Confirm clear</span>
              </a>
            </div>
          )}

          <div className="sidebar--content" onClick={toggleBugPopup}>
            <a>
              <img
                alt="contact-img"
                src={
                  isEnabled
                    ? "/images/loggedin/contact.png"
                    : "/images/loggedin/contact_l.png"
                }
                className="sidebar-image"
              />
              <span className="sidebar-text">Report Bug</span>
            </a>
          </div>
          <div className="sidebar--content" onClick={logoutUser}>
            <a>
              <img
                alt="logout-img"
                src={
                  isEnabled
                    ? "/images/loggedin/logout.png"
                    : "/images/loggedin/logout_l.png"
                }
                className="sidebar-image"
              />
              <span className="sidebar-text">Log Out</span>
            </a>
          </div>

          <div style={{ height: "20px" }}></div>
        </div>
      </>

      {/* background blur  */}
      {sidebarOpen && screenWidth <= 620 && (
        <div className="overlay" onClick={closeSidebarFromContent}></div>
      )}

      {/* CONTENT  */}
      <div className="content">
        {/* HEADER  */}
        <MyComponent>
          <Header switchFn={toggleSidebar} />
        </MyComponent>

        {/* chat area  */}
        <div
          className="chat-area"
          style={screenWidth <= 620 ? { paddingTop: "28px" } : {}}
        >
          <div
            className="chat-area-child"
            onScroll={() => onScroll()}
            ref={listInnerRef}
          >
            {needHistory && <ChatHistory />}

            {newQuestions.map((item, index) => (
              <div key={index} className="chatBoxItem">
                <div
                  className={index % 2 === 1 ? "answerChat" : "questionChat"}
                >
                  <div className="question-text-parent">
                    <div className="question-text-1">
                      <img
                        alt="logout-img"
                        src={
                          index % 2 === 1
                            ? "/images/loggedin/chat_gpt_logo.png"
                            : "/images/loggedin/user.png"
                        }
                        className="gpt-chat-icon"
                      />
                    </div>
                    <div className="question-text-2">
                      {/* <span key={index}>{item}</span> */}
                      <span
                        key={index}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    </div>
                  </div>
                </div>
                <div className="clear"></div>
              </div>
            ))}

            {tempQuestion && (
              <div className="chatBoxItem">
                <div className="questionChat">
                  <div className="question-text-parent">
                    <div className="question-text-1">
                      <img
                        alt="logout-img"
                        src="/images/loggedin/user.png"
                        className="gpt-chat-icon"
                      />
                    </div>
                    <div className="question-text-2">
                      <span>{tempQuestionVal}</span>
                    </div>
                  </div>
                </div>
                <div className="clear"></div>
              </div>
            )}

            {tempQuestion && (
              <ReactLoading type="bubbles" color="black" width={"80px"} />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll button */}
          <div>
            {showButton && (
              <img
                onClick={scrollBottom}
                alt="send"
                className="downImage"
                src="/images/loggedin/down2.png"
              />
            )}
          </div>

          {/* FORM AREA */}

          <div></div>
        </div>

        {/* <div className="testVoice">
        <form id="speech-recognition-form">
        <h2>Speech Recognition</h2>
        {!supported && (
          <p>
            Oh no, it looks like your browser doesn&#39;t support Speech
            Recognition.
          </p>
        )}
        {supported && (
          <React.Fragment>

            <label htmlFor="transcript">Transcript</label>
            <br/>
            <textarea
              id="transcript"
              name="transcript"
              placeholder="Waiting to take notes ..."
              value={value}
              rows={3}
              disabled
            />
            <button disabled={blocked} type="button" onClick={toggle}>
              {listening ? 'Stop' : 'Listen'}
            </button>
            {blocked && (
              <p style={{ color: 'red' }}>
                The microphone is blocked for this site in your browser.
              </p>
            )}
          </React.Fragment>
        )}
      </form>
        </div> */}


        {/* form area  */}
        <div className="form-area">
          {/* <ChatGPTdiv /> */}
          <div className="form-area-content">
            <div className="form-textbox">
              <form onSubmit={handleSubmit} id="question_form">
                <input type="text" className="ques--input" name="ques" />
              </form>
            </div>
            <button className="send-icon" form="question_form" type="submit">
              <img alt="send" src="/images/loggedin/send.png" width="30px" />
            </button>
            <div className="send-icon">
              <img alt="send" src="/images/loggedin/mic.png" width="14px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
