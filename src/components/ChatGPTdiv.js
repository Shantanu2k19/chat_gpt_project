import React from "react"

export default function LeftBox() {
    const [got_ans, set_ans] = React.useState('ask bitch');

    const [question, setPrompt] = React.useState('');


    const handleSubmit = async () => {
        console.log(question);

        const response = await fetch('http://localhost:5000/users/question_to_gpt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
          }).then(response => response.json())
          .then(data => set_ans(data.answer))
          .catch(error => console.error(error));
    };

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
                <input
                    type="text"
                    className="ques--input"
                    name="ques"
                    value={question}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            
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

{/* <div>
<button onClick={isSpeaking ? stop : speak}>
    {isSpeaking ? 'Stop' : 'Speak'}
</button>
<button onClick={olla}> hell </button>
</div> */}

{/* <form className="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(question);
                }}>

                <input
                    type="text"
                    className="form--input"
                    name="email"

                    value={question}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <button type="submit" className="button-85" role="button">ask</button>
                <br/>
                <span>response : {got_ans}</span>

             
            </form> */}