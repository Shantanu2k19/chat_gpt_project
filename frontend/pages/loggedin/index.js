import React, { useRef, useEffect } from "react";
import "../../styles/loggedin.css";
import ChatHistory from "./ChatHistory.js";
import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";

import { useRouter } from 'next/navigation';

const cookies = new Cookies();

export default function LandingPage() {
  console.log("langing page entered");

  //AUTHORIZING
  let router = useRouter();

  useEffect(() => {
    console.log("authorizing...");

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");

    if (!cAccToken) {
      // window.location.assign("/error");
      router.push('/error');
    }
  });

  //LOGOUT HANDLER
  const logoutUser = async () => {
    console.log("logging out");

    const token = cookies.get("refreshToken");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");

    router.push('/');

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

  const handleSubmit = async (e) => {
    console.log("question submitted");
    e.preventDefault();
    const question=e.target.ques.value;
    console.log(question);

    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const response = await fetch(
      "http://localhost:5000/users/question_to_gpt",
      {
        // const response = await fetch('http://localhost:5000/users/testApp', {
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
      console.log(json.answer);
      const ans = json.answer;
      setnewQuestions((prevItem) => [...prevItem, question, ans]);
    } else {
      console.log("cant get data");
    }
    console.log("updated");
  };

  //FOR SCROLLING TO BOTTOM
  const messagesEndRef = useRef(null);

  const scrollBottom = async (e) => {
    console.log("scroll to bottom const");

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollBottom();
  });

  //FOR SHOWING THE BUTTON : SCROLL TO BOTTOM
  const [showButton, setShowButton] = React.useState(false);

  const listInnerRef = useRef();

  const onScroll = () => {
    // console.log("listener");
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop + clientHeight >= scrollHeight-20) {
        // console.log('Reached bottom')
        setShowButton(false);
      } else {
        console.log('top')
        // setShowButton(true);
      }
    }
  };

  //RETURN DIV
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar--content">
          <a>
            <img
              alt="delete-img"
              src="/images/loggedin/delete.png"
              width="19px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text">
              Clear conversation
            </span>
          </a>
        </div>

        <div className="sidebar--content">
          <a>
            <img
              alt="darkmode-prop"
              src="/images/loggedin/moon.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text">
              Dark Mode
            </span>
          </a>
        </div>
        <div className="sidebar--content">
          <a>
            <img
              alt="contact-img"
              src="/images/loggedin/contact.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" >
              Contact Developers
            </span>
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
            <span className="sidebar-text">
              Log Out
            </span>
          </a>
        </div>
        <div className="sidebar--content">
          <a>
            <img
              alt="logout-img"
              src="/images/loggedin/logout.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text">
              Get Data
            </span>
          </a>
        </div>
      </div>

      <div className="content">
        <div className="chat-area">
          <div
            className="chat-area-child"
            onScroll={() => onScroll()}
            ref={listInnerRef}
          >
            <ChatHistory />

            {/* new chat adding */}
            {/* <ChatGPTdiv /> */}

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
            <div ref={messagesEndRef} />
          </div>
        </div>

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

        <div className="form-area">
          {/* <ChatGPTdiv /> */}
          <div className="form-area-content">
            <div className="form-textbox">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="ques--input"
                  name="ques"
                  // value={question}
                  // onChange={(e) => setPrompt(e.target.value)}
                />
              </form>
            </div>
            <div className="send-icon">
              <img alt="send" src="/images/loggedin/send.png" width="30px" />
            </div>
            <div className="send-icon">
              <img alt="send" src="/images/loggedin/mic.png" width="14px" />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
