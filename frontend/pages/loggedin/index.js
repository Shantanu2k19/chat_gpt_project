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
const cookies = new Cookies();

export default function LandingPage() {
  console.log("langing page entered");
  const theme = "dark";

  function showAlert(mssg) {
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
  });

  //LOGOUT HANDLER
  const logoutUser = async () => {
    console.log("logging out");

    const token = cookies.get("refreshToken");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");

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

  // console.log("needHistory :", needHistory);

  const handleSubmit = async (e) => {
    // console.log("question submitted");
    e.preventDefault();
    setTempQuestionVal(e.target.ques.value);
    setTempQuestion(true);

    const question = e.target.ques.value;
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
      console.log("cant get data");
    }
    // console.log("updated");

    setTempQuestion(false);
  };

  //CLEAR CONVERSATION
  const clearConversation = async () => {
    console.log("clearing conversation");
    showAlert("clearing conversation");

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

    if (response.ok) {
      console.log("Clear chat success");
      setnewQuestions([]);
      setneedHistory(false);
    } else {
      console.log("server issue in clearing, check");
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
    showAlert("Pro mode give faster responses. Coming soon!");
  }

  function switchTheme() {
    showAlert("Themes Coming soon!");
  }

  function reportBug() {
    showAlert("Coming soon!");
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
    console.log("starting page");
    setScreenWidth(window.innerWidth);

    console.log(screenWidth);

    if (screenWidth <= 620) {
      setSideBarOpen(false);
    } else {
      setSideBarOpen(true);
    }
    console.log("setting");
  }, [screenWidth]);

  const toggleSidebar = () => {
    setSideBarOpen(!sidebarOpen);
  };

  const closeSidebarFromContent = () => {
    if (sidebarOpen) setSideBarOpen(false);
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

      {/* SIDEBAR  */}
      <>
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
          <div className="sidebar--content" onClick={proMode}>
            <a>
              <img
                alt="delete-img"
                src="/images/loggedin/pro_d.png"
                width="18px"
                style={{ marginRight: "10px" }}
              />
              <span className="sidebar-text">Pro mode</span>
            </a>
          </div>

          <div className="sidebar--content" onClick={clearConversation}>
            <a>
              <img
                alt="delete-img"
                src="/images/loggedin/delete.png"
                width="19px"
                style={{ marginRight: "10px" }}
              />
              <span className="sidebar-text">Clear conversation</span>
            </a>
          </div>

          <div className="sidebar--content" onClick={switchTheme}>
            <a>
              <img
                alt="darkmode-prop"
                src="/images/loggedin/moon.png"
                width="18px"
                style={{ marginRight: "10px" }}
              />
              <span className="sidebar-text">Switch Theme</span>
            </a>
          </div>
          <div className="sidebar--content" onClick={reportBug}>
            <a>
              <img
                alt="contact-img"
                src="/images/loggedin/contact.png"
                width="18px"
                style={{ marginRight: "10px" }}
              />
              <span className="sidebar-text">Report Bug</span>
            </a>
          </div>
          <div className="sidebar--content" onClick={logoutUser}>
            <a>
              <img
                alt="logout-img"
                src="/images/loggedin/logout.png"
                width="18px"
                style={{ marginRight: "10px" }}
              />
              <span className="sidebar-text">Log Out</span>
            </a>
          </div>
        </div>
        {/* { sidebarOpen && screenWidth<=620 && (<button className="lol" onClick={toggleSidebar}>closse</button>)} */}
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
