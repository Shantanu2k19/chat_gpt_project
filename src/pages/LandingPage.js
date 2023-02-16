import React from "react"
import ChatGPTdiv from '../components/ChatGPTdiv.js'
import '../css/LandingPage.css'
import { Link } from 'react-router-dom';

export default function Testpage() {
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
                <div className="sidebar--content">
                    <Link to="/">
                        <img alt="logout-img" src="images/logout.png" width="18px" style={{ marginRight: "10px" }} /><span className="sidebar-text" href="#log_out">Log Out</span>
                    </Link>
                </div>
            </div>

            <div className="content">
                <div className="chat-area">
                    chat area 
                </div>
                <div className="form-area">
                    <ChatGPTdiv />
                </div>
            </div>
        </div>
    )
};