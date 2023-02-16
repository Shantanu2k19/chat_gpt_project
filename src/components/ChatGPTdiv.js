import React from "react"
import axios from 'axios';

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



    return (
        <div className="form--content">
            <form className="form" 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(question);
                }
            }>

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
            </form>
        </div>
    )
};