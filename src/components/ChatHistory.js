import React from "react"
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie"


export default function ChatHistory() {
    console.log("chat_history entered")
    const cookies = new Cookies();

    const [textFronServer, setTextFronServer] = React.useState("frontend");

        //useless now?
    const getTextFromBackend = async () => {
    
        // const [accTok, setaccTok] = React.useState("acc");
        // const [refTok, setrefTok] = React.useState("ref");
    
        const cAccToken = cookies.get("accessToken");
        const reftoken = cookies.get("refreshToken");
    
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

    const [chatHistory, setchatHistory] = React.useState(['Item 1', 'Item 2']);
    
    React.useEffect(() => {
        async function fetchData() {

            const cookies = new Cookies();
            const cAccToken = cookies.get("accessToken");
            const reftoken = cookies.get("refreshToken");

            const response = await fetch('http://localhost:5000/users/getChatHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cAccToken}`
                },
                body: JSON.stringify({reftoken})
            });

            const json = await response.json();

            if (response.ok) {
                setchatHistory(json.arr);
            }
            else{
                console.log("cant get history data");
            }
        }
        fetchData();
    }, []);

    const chatSnippet = chatHistory.map( (ele, ind)=> {
        return <ChatItem 
        item = {ele} 
        index = {ind}/>
    })

    return (
        <div>
            {chatSnippet}
        </div>
    )
};

export function ChatItem(props){
    // console.log(props)
    if(props.index %2 === 0 )
    {
        return(
            <div classname="chatBoxItem">
                <div className="questionChat">
                    <div className="question-text-parent">
                        <div className="question-text-1" >
                            <img alt="logout-img" src="images/user.png" className="gpt-chat-icon"/>             
                        </div>
                        <div className="question-text-2">
                            <span key={props.index}>{props.item} {props.index}</span>
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }

    return(
        <div classname="chatBoxItem">
            <div className="answerChat">
                <div className="question-text-parent">
                    <div className="question-text-1" >
                        <img alt="logout-img" src="images/chat_gpt_logo.png" className="gpt-chat-icon"/>             
                    </div>
                    <div className="question-text-2">
                        <span key={props.index}>{props.item} {props.index}</span>
                    </div>
                </div>
            </div>
            <div className="clear"></div>
        </div>
    )
}
