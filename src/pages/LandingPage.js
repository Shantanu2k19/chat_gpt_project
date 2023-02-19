import React from "react"
import ChatGPTdiv from '../components/ChatGPTdiv.js'
import ChatHistory from '../components/ChatHistory.js'
import '../css/LandingPage.css'
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie"
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();


export default function LandingPage() {

    // console.log("checking authorization!")

    // const navigate = useNavigate();
    // console.log(cookies.get("accessToken"));
    // if(!cookies.get("accessToken"))
    // {
    //     console.log("not logged in");
    //     navigate('/error')
    //     // return <Navigate to={{ 
    //     //     pathname: '/error', 
    //     // }} />
    // }
    // console.log("allowed!");


    const logoutUser = async (event) => {
        console.log("logging out");

        const token = cookies.get("refreshToken");
        cookies.remove("accessToken");
        cookies.remove("refreshToken");

        const response = await fetch('http://localhost:5000/users/logout', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          if (response.ok) {
            console.log("logout success");
          }
          else{
            console.log("server issue in logout, check")
          }
    }

    return (
        <div>
            <div className="sidebar">
                <div className="sidebar--content">
                    <a href="delete">
                        <img alt="delete-img" src="images/delete.png" width="19px" style={{ marginRight: "10px" }} /><span className="sidebar-text" href="#clear_conversations">Clear conversation</span>
                    </a>
                </div>

                <div className="sidebar--content">
                    <a href="darkmode">
                        <img alt="darkmode-prop" src="images/moon.png" width="18px" style={{ marginRight: "10px" }} /><span className="sidebar-text" href="#darkmode">Dark Mode</span>
                    </a>
                </div>
                <div className="sidebar--content">
                    <a href="#contact">
                        <img alt="contact-img" src="images/contact.png" width="18px" style={{ marginRight: "10px" }} /><span className="sidebar-text" href="#contact_developers">Contact Developers</span>
                    </a>
                </div>
                <div className="sidebar--content" onClick={logoutUser}>
                    <Link to="/">
                        <img alt="logout-img" src="images/logout.png" width="18px" style={{ marginRight: "10px" }} /><span className="sidebar-text" href="#log_out">Log Out</span>
                    </Link>
                </div>
            </div>

            <div className="content">
                <div className="chat-area">
                    <ChatHistory/>
                </div>
                <div className="form-area">
                    <ChatGPTdiv />
                </div>
            </div>
        </div>
    )
};