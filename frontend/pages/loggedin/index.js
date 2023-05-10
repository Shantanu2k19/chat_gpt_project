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
import useSpeechRecognition from "./voiceHelper/S2Thelper";
import SettingPopup from "./SettingsPopup";
import test_sound from "../../public/audios/test_audio.mp3";
import Animation from "./Animation";
const cookies = new Cookies();
import config from '../../next.config.js'

export default function LandingPage() {
  // console.log("langing page entered");
  let router = useRouter();  

  //********************   FOR DARK MODE   ********************
  let theme = "dark";
  const [isDarkEnabled, setIsDarkEnabled] = useState(true);
  
  const toggleDarkMode = () => {
    setIsDarkEnabled((prevState) => !prevState);
  };

  const updateTheme = (isDarkEnabled) => {
    const styles = getComputedStyle(document.body);
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
    isDarkEnabled ? (theme = "dark") : (theme = "light");
    updateTheme(isDarkEnabled);
  }, [isDarkEnabled]);




  //********************   ALERT FUNCTION    ********************
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




  //********************   AUTHORIZING   ********************

  const [userName, setUserName] = React.useState("user");
  const [userPic, setUserPic] = React.useState("_");

  useEffect(() => {
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





  //********************   LOGOUT HANDLER   ********************
  const logoutUser = async () => {
    console.log("logging out");

    const token = cookies.get("refreshToken");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    cookies.remove("userName");
    cookies.remove("userPic");

    router.push("/");

    const response = await fetch(`${config.serverUrl}/users/logout`, {
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




  //********************   CLEAR CONVERSATION   ********************
  const clearConversation = async () => {
    setConfirmDelete(false);

    console.log("clearing conversation");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(`${config.serverUrl}/users/clearChat`, {
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
      setnewQuestions([]);
      setneedHistory(false);
    } else {
      showAlert(json.message, 1);
    }
  };




  //********************   SCROLL HANDLING   ********************
  const messagesEndRef = useRef(null);

  const scrollBottom = async (e) => {
    // console.log("scroll to bottom");

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



//********************   SIDEBAR HANDLING MINIMISE/MAXM ********************

  const MyComponent = styled.div`
  display: none;

  @media (max-width: 620px) {
    display: inline;
  }
  `;

  //sidebar using react
  const [sidebarOpen, setSideBarOpen] = React.useState(false);
  const [screenWidth, setScreenWidth] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

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

    if (screenWidth <= 454) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

  }, [screenWidth]);

  const toggleSidebar = () => {
    setSideBarOpen(!sidebarOpen);
  };

  const closeSidebarFromContent = () => {
    if (sidebarOpen) setSideBarOpen(false);
  };




//********************   SIDEBAR FUNCTIONS ********************
  function proMode() {
    showAlert("Pro mode gives faster responses. Coming soon!", 0);
  }

  function myAccount() {
    showAlert("Hi, cutie", 0);
  }

  

//********************   REPORT BUG POPUP   ********************
  const [bugPopEnabled, setBugPopEnabled] = React.useState(false);
  const [bugData, setBugData] = React.useState("");

  function toggleBugPopup() {
    setBugPopEnabled(!bugPopEnabled);
  }

  const reportedBug = async (e) => {
    console.log("reporting bug");

    if (bugData.length <= 1) {
      showAlert("Express more :)", 0);
      return;
    }

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(`${config.serverUrl}/users/reportBug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cAccToken}`,
      },
      body: JSON.stringify({ bugData, reftoken }),
    });

    const json = await response.json();

    if (response.ok) {
      showAlert("Thanks for letting us know :)", 0);
    } else {
      showAlert(json.message, 1);
    }
    setBugData("");
    toggleBugPopup();
  };





//********************   VOICE SETTINGS POPUP   ********************
  const [stnPopup, setStnPopup] = React.useState(false);

  //GET PREFERENCE OF USER
  const getPrefs = async () => {
    console.log("get pref");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(`${config.serverUrl}/users/get_prefs`, {
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

      setVoiceIndex(json.data[0]["voice"]);
      setPitch(json.data[0]["pitch"]);
      setRate(json.data[0]["rate"]);
      setIsGoogleVoice(json.data[0]["gnable"]);
    } else {
      showAlert(json.message, 1);
    }
  };

  React.useEffect(() => {
    if(cookies.get("userName")!="demo_user")getPrefs();
  }, []);

  //SET PREFERENCE OF USER
  const setPrefs = async () => {
    console.log("get pref");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const newPrefs = {
      gnable: isGoogleVoice,
      voice: voiceIndex == "" ? 3 : voiceIndex,
      rate: rate,
      pitch: pitch,
    };
    const response = await fetch(`${config.serverUrl}/users/set_prefs`, {
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


  //close function for all popups 
  function closePopups() {
    setBugPopEnabled(false);
    setStnPopup(false);
  }

//********************   STATES FOR SYNCING   ********************
  const [isVoiceChatEnabled, setisVoiceChatEnabled] = useState(false);
  const [currentMicState,setCurrentMicState] = useState(1);

/*

micState : 1- idle, 2-listening, 3-speaking



*/


//********************   FOR HANDLING TEXT TO SPEECH   ********************
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(1);

  const [isGoogleVoice, setIsGoogleVoice] = useState(false);

  const onEnd = () => {
    console.log("SPEAKING END");
    setCurrentMicState(1);
    mic_button.current.click();
  };

  const tempVar = useSpeechSynthesis({
    onEnd,
  });

  const supported = tempVar[0];
  const speak = tempVar[1];
  const speaking = tempVar[2];
  const cancel = tempVar[3];
  const voices = tempVar[4];

  const voice = voices[voiceIndex] || 3;

  const audioRef = useRef();

  function testSpeach() {
    const text = "this is a test audio";
    isGoogleVoice
      ? audioRef.current.play()
      : speak({ text, voice, rate, pitch });
  }






//********************   FOR HANDLING SPEECH TO TEXT   ********************

  const [lang, setLang] = useState("en-AU");
  const [blocked, setBlocked] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null)
  const mic_button = useRef(null)

  const onEnd2 = () => {

    if(!isVoiceChatEnabled) return;

    setCurrentMicState(1);
    console.log("question :", inputRef.current.value);
    buttonRef.current.click();
  };

  const onResult = (result) => {
    inputRef.current.value=result;
  };

  const changeLang = (event) => {
    setLang(event.target.value);
  };

  const onError = (event) => {
    if (event.error === "not-allowed") {
      showAlert("Please allow Mic access and reload!",1);
      setBlocked(true);
    }
  };

  const tempVar2 = useSpeechRecognition({
    onResult,
    onEnd2,
    onError,
  });

  const listen = tempVar2[0];
  const listening = tempVar2[1];
  const stop = tempVar2[2];
  const supportedS2T = tempVar2[3];


  // const toggleAudio = listening
  //   ? 
  //     stop
  //   : () => 
  //     {
  //       inputRef.current.value = "";
  //       setCurrentMicState(2);
  //       setBlocked(false);
  //       console.log("listening...");
  //       listen({ lang });
  //     };

  function toggleAudio(){
    if(!isVoiceChatEnabled)
    {
      setCurrentMicState(2);
      setBlocked(false);
      console.log("listening...");
      listen({ lang });
    }
  }














  //********************   FOR HANDLING VoiceChatEnabled ENABLE/DISABLE   ********************
  
  const [speakingState, setSpeakingState] = React.useState();

  React.useEffect(()=>{
    console.log("currentMicState :::",currentMicState)
    switch(currentMicState)
    {
      case(1): setSpeakingState("Idle...");
                return;
      case(2): setSpeakingState("Listening question...");
                return;
      case(3): setSpeakingState("Speaking answer...");
                return;
      default: setSpeakingState("Hmm, some error!...");
                return;
    }
  },[currentMicState])

  function setMicProp() {

    if(isVoiceChatEnabled)
    {
      //turn off voice chat 
      setisVoiceChatEnabled(false);
      cancel();
      stop;
      showAlert("Interactive mode Off.",0);
      return;
    }

    //turn on voice chat 
    if(!supported)
    {
      showAlert("Your browser does not support mic!! :(", 1);
      return;
    }
    setisVoiceChatEnabled(true);
    showAlert("Interactive mode On! Click on mic to start.",0)
  }

  function turnOffVoice(){
    setisVoiceChatEnabled(false);
    cancel();
    stop;
    setCurrentMicState(1);
    console.log("done");
  }

  function speakAnswer(speakingText){
    if(!isVoiceChatEnabled)
    {
      turnOffVoice();
      return;
    }

    setCurrentMicState(3);
    const text = speakingText;
    speak({ text, voice, rate, pitch });
    console.log("speaking answer");
  }

  function listenQuestion(){
    if(!isVoiceChatEnabled)
    {
      setBlocked(false);
      console.log("listening...");
      listen({ lang });
      setCurrentMicState(1);
      return;
    }

    //voice enabled
    setBlocked(false);
    console.log("listening...");
    listen({ lang });
    setCurrentMicState(2);
  }


  //********************   ASK QUESTION AND ADD TO HISTORY TAB AREA   ********************
  const [newQuestions, setnewQuestions] = React.useState([]);
  const [needHistory, setneedHistory] = React.useState(true);
  const [tempQuestion, setTempQuestion] = React.useState(false);
  const [tempQuestionVal, setTempQuestionVal] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSubmit = async (e) => {
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
      `${config.serverUrl}/users/question_to_gpt`,
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

    const serverErrorResponses = [
      "Sorry, the server is unavailable at the moment. Please try again later.",
      "Unable to establish a connection with the server right now. Please retry later.",
      "The server is currently unreachable. You may want to attempt connecting again later.",
      "Connection to the server is not possible at this time. Please try again later.",
      "We're experiencing difficulties connecting to the server. Please try later.",
      "Apologies, but the server is not accessible right now. Please try again later.",
    ];
    
    if (response.ok) {
      // console.log(json.answer);
      const ans = json.answer;
      setnewQuestions((prevItem) => [...prevItem, question, ans]);
      //console.log("ayoooo, ",ans)
      
      if(isVoiceChatEnabled)
      {
        speakAnswer(ans);
      } 

    } else {
      var randomNumber = Math.floor(Math.random() * 6);
      const ans = serverErrorResponses[randomNumber];
      setnewQuestions((prevItem) => [...prevItem, question, ans]);
      console.log("cant get answer");
    }
    setTempQuestion(false);
  };


  //********************   RETURN DIV   ********************
  return (
    <div className="home">
    
    {/* Overlay and Alerts  */}
      <>
      {isMobile && 
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
          style={{ maxWidth:'80%', left:"10%", top:"1em"}}
        />
      }

      {!isMobile && 
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
      }

      {bugPopEnabled && (
        <div className="overlay2" onClick={closePopups}>
          {" "}
        </div>
      )}
      {stnPopup && (
        <div className="overlay2" onClick={closePopups}>
          {" "}
        </div>
      )}
      </>

      {/* SIDEBAR  */}
      <>
        <title>Neural Talk</title>
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
            <button className="button-17" onClick={reportedBug}>
              Submit
            </button>
            <div style={{ width: "33px" }}></div>
            <button className="button-17" onClick={toggleBugPopup}>
              Close
            </button>
          </div>
        </div>

        <audio ref={audioRef}>
          <source src={test_sound} type="audio/mpeg" />
        </audio>

        <SettingPopup
          supported={supported}
          stnPopup={stnPopup}
          pitch={pitch}
          setPitch={setPitch}
          rate={rate}
          setRate={setRate}
          voices={voices}
          voiceIndex={voiceIndex}
          setVoiceIndex={setVoiceIndex}
          isGoogleVoice={isGoogleVoice}
          setIsGoogleVoice={setIsGoogleVoice}
          testSpeach={testSpeach}
          setPrefs={setPrefs}
        />

        <div
          className="sidebar"
          style={
            screenWidth <= 620
              ? sidebarOpen
                ? { left: "0px", position: "absolute" }
                : { left: "-270px", position: "absolute" }
              : sidebarOpen
              ? { left: "0px", position: "static" }
              : { left: "-270px", position: "static" }
          }
        >
          <div className="sidebar--content2" onClick={myAccount}>
            <div className="my-account">
              <img
                alt="user-img"
                src={
                  userPic != "_"
                    ? userPic
                    : isDarkEnabled
                    ? "/images/loggedin/user_d.png"
                    : "/images/loggedin/user_l.png"
                }
                className="my-account-image"
              />
              <br />
              <span className="sidebar-text">{userName}</span>
            </div>
          </div>

          {/* switch theme  */}
          <div className="sidebar--content2">
            <br />

            <label className="toggle-wrapper" htmlFor="toggle">
              <div
                className={`toggle ${isDarkEnabled ? "enabled" : "disabled"}`}
              >
                <div className="icons">
                  <img className="iconkk" src="/images/loggedin/sun.png"></img>
                  <img className="iconkk" src="/images/loggedin/moon.png"></img>
                  {/* <MoonIcon /> */}
                </div>
                <input
                  id="toggle"
                  name="toggle"
                  type="checkbox"
                  checked={isDarkEnabled}
                  onClick={toggleDarkMode}
                />
              </div>
            </label>
          </div>

          {/* switch mode  */}
          {/* <div className="sidebar--content2">
            <br />

            <label className="toggle-wrapper" htmlFor="toggle2">
              <div
                className={`toggle2 ${isVoiceChatEnabled ? "enabled2" : "disabled2"}`}
              >
                <div className="icons">
                  <img
                    className="iconVoiceChange"
                    src={
                      isDarkEnabled
                      ? "/images/loggedin/voice-chat_d.png"
                      : "/images/loggedin/voice-chat_l.png"
                    }
                  ></img>
                  <img
                    className="iconVoiceChange"
                    src={
                      isDarkEnabled
                      ? "/images/loggedin/voice-chat-block_d.png"
                      : "/images/loggedin/voice-chat-block_l.png"
                    }
                  ></img>
                </div>
                <input
                  id="toggle2"
                  name="toggle2"
                  type="checkbox"
                  checked={isVoiceChatEnabled}
                  onClick={setMicProp}
                />
              </div>
            </label>
            <div className="info-text">Interactive mode {isVoiceChatEnabled ? "Enabled" : "Disabled"}</div>
          </div> */}

          <div style={{ flexGrow: "1" }}></div>
          {screenWidth > 620 && (
            <div className="threeDiv2" style={{ height: "20px"}}>
              <div className="left-div2">
                { !isVoiceChatEnabled ? "Tap 💭 to enable Interactive Mode..." : speakingState }
              </div>
              <div
                className="dot"
                style={{
                  backgroundColor: isVoiceChatEnabled ? "rgb(16, 219, 16)" : "gray",
                }}
              ></div>
            </div>
          )}

          <br/>

          <hr style={{ width: "90%", color: "rgba(255, 255, 255, 0.226)" }} />

          <div className="sidebar--content" onClick={proMode}>
            <div className="threeDiv2">
              <div className="left-div">
                <img
                  alt="delete-img"
                  src={
                    isDarkEnabled
                      ? "/images/loggedin/pro_d.png"
                      : "/images/loggedin/pro_l.png"
                  }
                  className="sidebar-image"
                />
              </div>
              <div className="right-div2">
                <span className="sidebar-text">Pro mode</span>
              </div>
            </div>
          </div>

          <div
            className="sidebar--content"
            onClick={() => setStnPopup(!stnPopup)}
          >
            <div className="threeDiv2">
              <div className="left-div">
                <img
                  alt="delete-img"
                  src={
                    isDarkEnabled
                      ? "/images/loggedin/mic.png"
                      : "/images/loggedin/mic_l.png"
                  }
                  className="sidebar-image"
                />
              </div>
              <div className="right-div2">
                <span className="sidebar-text">Voice Settings</span>
              </div>
              <span className="new-feature">NEW</span>
            </div>
          </div>

          {!confirmDelete && (
            <div
              className="sidebar--content"
              onClick={() => setConfirmDelete(true)}
            >
              <div className="threeDiv2">
                <div className="left-div">
                  <img
                    alt="delete-img"
                    src={
                      isDarkEnabled
                        ? "/images/loggedin/delete.png"
                        : "/images/loggedin/delete_l.png"
                    }
                    className="sidebar-image"
                  />
                </div>
                <div className="right-div2">
                  <span className="sidebar-text">Clear conversation</span>
                </div>
              </div>
            </div>
          )}

          {confirmDelete && (
            <div className="sidebar--content" onClick={clearConversation}>
              <div className="threeDiv2">
                <div className="left-div">
                  <img
                    alt="delete-img"
                    src={
                      isDarkEnabled
                        ? "/images/loggedin/clear.png"
                        : "/images/loggedin/clear_l.png"
                    }
                    className="sidebar-image"
                  />
                </div>
                <div className="right-div2">
                  <span className="sidebar-text">Confirm clear</span>
                </div>
              </div>
            </div>
          )}

          <div className="sidebar--content" onClick={toggleBugPopup}>
            <div className="threeDiv2">
              <div className="left-div">
                <img
                  alt="contact-img"
                  src={
                    isDarkEnabled
                      ? "/images/loggedin/contact.png"
                      : "/images/loggedin/contact_l.png"
                  }
                  className="sidebar-image"
                />
              </div>
              <div className="right-div2">
                <span className="sidebar-text">Report Bug</span>
              </div>
            </div>
          </div>
          <div className="sidebar--content" onClick={logoutUser}>
            <div className="threeDiv2">
              <div className="left-div">
                <img
                  alt="logout-img"
                  src={
                    isDarkEnabled
                      ? "/images/loggedin/logout.png"
                      : "/images/loggedin/logout_l.png"
                  }
                  className="sidebar-image"
                />
              </div>
              <div className="right-div2">
                <span className="sidebar-text">Log Out</span>
              </div>
            </div>
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
          <Header 
            switchFn={toggleSidebar} 
            isVoiceChatEnabled={isVoiceChatEnabled} 
            speakingState = {speakingState}
        />
        </MyComponent>

        {/* chat area  */}
        <div
          className="chat-area"
          style={screenWidth <= 620 ? { paddingTop: "45px" } : {paddingTop: "10px"}}
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

        {/* form area  */}
        <div className="bottom-area">
          {/* <ChatGPTdiv /> */}
          <div className="question-content">
            <form
              className="form-textbox"
              onSubmit={handleSubmit}
              id="question_form"
            >
                <input 
                  type="text" 
                  className="ques--input" 
                  name="ques"
                  ref={inputRef}
                  placeholder="Ask a question..."
              />              
            </form>

            <button 
              disabled={blocked} 
              type="button" 
              onClick={listenQuestion} 
              className="send-icon" 
              style={{margin: "0px", animation: listening?"pulsate 1s infinite ease-out":"none"}}
              ref={mic_button}
            >
            <img
                alt="tapToSpeak"
                src={
                  isDarkEnabled
                    ? "/images/loggedin/mic_thin_d.png"
                    : "/images/loggedin/mic_thin_l.png"
                }
                width="24px"
              />
            </button>

            <button className="send-icon" form="question_form" type="submit" ref={buttonRef}>
              <img
                alt="send"
                src={
                  isDarkEnabled
                    ? "/images/loggedin/send.png"
                    : "/images/loggedin/send_l.png"
                }
                width="24px"
              />
            </button>
            {/* <div className="send-icon">
              <img alt="send" src="/images/loggedin/mic.png" width="14px" />
            </div> */}
          </div>
          <div className="animation-content" onClick={setMicProp}>
            <Animation 
            voiceEnabled={isVoiceChatEnabled}
            currentMicState={currentMicState}
            isMobile = {isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


