import React from "react"
import ChatGPTdiv from '../components/ChatGPTdiv.js'
import '../css/LandingPage.css'

export default function LandingPage() {
    return (
        <div className="global-body">


            <div className="sidebar">


                <hr />
                <div className="sidebar--content">
                    <a href="delete">
                        <img src="images/delete.png" width="20px" style={{marginRight:"10px"}}/><span href="#clear_conversations">Clear conversations</span>
                    </a>
                </div>

                <div className="sidebar--content">
                    <a href="darkmode">
                        <img src="images/moon.png" width="20px" style={{marginRight:"10px"}} /><span href="#darkmode">Dark Mode</span>
                    </a>
                </div>
                <div className="sidebar--content">
                    <a href="#contact">
                        <img src="images/contact.png" width="20px" style={{marginRight:"10px"}}/><span href="#contact_developers">Contact Developers</span>
                    </a>
                </div>
                <div className="sidebar--content">
                    <a href="#logout">
                        <img src="images/logout.png" width="20px" style={{marginRight:"10px"}}/><span href="#log_out">Log Out</span>
                    </a>
                </div>

            </div>

            <div className="content">
                <ChatGPTdiv />
            </div>

        </div>
    )
}