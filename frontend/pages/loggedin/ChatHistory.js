import React from "react"
import Cookies from "universal-cookie"


export default function ChatHistory(prop) {
    console.log("chat_history entered")

    const [chatHistory, setchatHistory] = React.useState(['Nothing available', 'Try logging-in again']);

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
        key = {ind}
        item = {ele} 
        index = {ind}/>
    })

    return (
        <div style={{color: "red"}}>
            {chatSnippet}
        </div>
    )
};

export function ChatItem(props){
    // console.log(props)
    if(props.index %2 === 0 )
    {
        return(
            <div className="chatBoxItem">
                <div className="questionChat">
                    <div className="question-text-parent">
                        <div className="question-text-1" >
                            <img alt="logout-img" src="/images/loggedin/user.png" className="gpt-chat-icon"/>             
                        </div>
                        <div className="question-text-2">
                            <span key={props.index}>{props.item}</span>
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }

    return(
        <div className="chatBoxItem">
            <div className="answerChat">
                <div className="question-text-parent">
                    <div className="question-text-1" >
                        <img alt="logout-img" src="/images/loggedin/chat_gpt_logo.png" className="gpt-chat-icon"/>             
                    </div>
                    <div className="question-text-2">
                        {/* <span key={props.index}>{props.item}</span> */}
                        <span key={props.index} dangerouslySetInnerHTML={{ __html: props.item }} />
                    </div>
                </div>
            </div>
            <div className="clear"></div>
        </div>
    )
}
