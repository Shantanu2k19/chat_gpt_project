import React from "react"
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie"

export default function ChatHistory() {
    const cookies = new Cookies();
    const [textFronServer, setTextFronServer] = React.useState("frontend");

    // const [accTok, setaccTok] = React.useState("acc");
    // const [refTok, setrefTok] = React.useState("ref");

    const cAccToken = cookies.get("accessToken");
    const reftoken = cookies.get("refreshToken");

    const getTextFromBackend = async () => {
        console.log("getting from backend");

        const response = await fetch('http://localhost:5000/users/test', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cAccToken}`
            },
            body: JSON.stringify({reftoken})
        });

            const data = await response.json();
            if (response.ok) {
                setTextFronServer(data.text);

                if(data.newToken != cAccToken)
                    cookies.set("accessToken", data.newToken);
            }
            else{
                setTextFronServer("Error, no auth");
            }
    }

    return (
        <div>
            chat history 
            <br/>
            <br/>
            <br/>
            <br/>

            <button onClick={getTextFromBackend}>click for backend response</button>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <span>{textFronServer}</span>
        </div>
    )
};