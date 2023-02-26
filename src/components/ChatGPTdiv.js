import React from "react"
import Cookies from "universal-cookie"

export default function LeftBox() {

    const [question, setPrompt] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(question);

        const cookies = new Cookies();
        const cAccToken = cookies.get("accessToken");
        const reftoken = cookies.get("refreshToken");

        const response = await fetch('http://localhost:5000/users/question_to_gpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                Authorization: `Bearer ${cAccToken}`
            },
            body: JSON.stringify({ question, reftoken })
        })
          
        const json = await response.json();

        if (response.ok) {
            console.log(json.answer)
            // setchatHistory( prev => ({
            //     array:[...prev, json.answer]
            // }))
        }
        else{
            console.log("cant get data");
        }
    };


    // For speech 
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    function TextToSpeech({ text }) {    
        const speak = () => {
          const message = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(message);
          setIsSpeaking(true);
        };
      
        const stop = () => {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        };
    }
    function olla(){
        const message = new SpeechSynthesisUtterance("hello there my name is hahaha");
        window.speechSynthesis.speak(message);
    }

    return (
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
                <img alt="send" src="images/send.png" width="30px"/>
            </div>
            <div className="send-icon">
                <img alt="send" src="images/mic.png" width="14px"/>
            </div>
        </div>
    )
};