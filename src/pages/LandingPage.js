import React, { useRef, useEffect } from "react";
import ChatHistory from "../components/ChatHistory.js";
import ChatGPTdiv from "../components/ChatGPTdiv.js";
import "../css/LandingPage.css";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

export default function LandingPage() {
    console.log("landinggggg")
  //LOGOUT HANDLER
  const logoutUser = async () => {
    console.log("logging out");

    const token = cookies.get("refreshToken");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");

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
  const [question, setPrompt] = React.useState("");
  const [newQuestions, setnewQuestions] = React.useState([]);

  const handleSubmit = async (e) => {
    console.log("question submitted");
    e.preventDefault();
    setPrompt("");
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
  let navigate = useNavigate();


  useEffect(() => {
    console.log("effectdddd");

    // scrollBottom();
    const cookies = new Cookies();
    const cAccToken = cookies.get("accessToken");


    // function Component() {
    //     let navigate = useNavigate();
    //     navigate("/error");
    // }


    if (!cAccToken) {
      // window.location.assign("/error");
        navigate("/error");
    }

  });

 

  //FOR SHOWING THE BUTTON : SCROLL TO BOTTOM
  const [showButton, setShowButton] = React.useState(false);

  const listInnerRef = useRef();

  const onScroll = () => {
    console.log("listener");
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        //   console.log('Reached bottom')
        setShowButton(false);
      } else {
        // console.log('top')
        setShowButton(true);
      }
    }
  };

  //RETURN DIV
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar--content">
          <a href="delete">
            <img
              alt="delete-img"
              src="images/delete.png"
              width="19px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" href="#clear_conversations">
              Clear conversation
            </span>
          </a>
        </div>

        <div className="sidebar--content">
          <a href="darkmode">
            <img
              alt="darkmode-prop"
              src="images/moon.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" href="#darkmode">
              Dark Mode
            </span>
          </a>
        </div>
        <div className="sidebar--content">
          <a href="#contact">
            <img
              alt="contact-img"
              src="images/contact.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" href="#contact_developers">
              Contact Developers
            </span>
          </a>
        </div>
        <div className="sidebar--content" onClick={logoutUser}>
          <Link to="/">
            <img
              alt="logout-img"
              src="images/logout.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" href="#log_out">
              Log Out
            </span>
          </Link>
        </div>
        <div className="sidebar--content">
          <a href="#contact">
            <img
              alt="logout-img"
              src="images/logout.png"
              width="18px"
              style={{ marginRight: "10px" }}
            />
            <span className="sidebar-text" href="#log_out">
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
                            ? "images/chat_gpt_logo.png"
                            : "images/user.png"
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
              src="images/down2.png"
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
                  value={question}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </form>
            </div>
            <div className="send-icon">
              <img alt="send" src="images/send.png" width="30px" />
            </div>
            <div className="send-icon">
              <img alt="send" src="images/mic.png" width="14px" />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
