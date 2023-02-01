import React from "react"
import { Configuration, OpenAIApi } from "openai";


export default function LeftBox() {

    const keyy = "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";

    const configuration = new Configuration({
        apiKey: keyy,
    });

    const openai = new OpenAIApi(configuration);

    const response="";

    const handleSubmit = async (prompt) => {
        console.log(prompt);
        // return 
        try {
            const completions = await openai.createCompletion({
                engine: "text-davinci-002",
                prompt: prompt,
                max_tokens: 1024,
                n: 1,
                stop: null,
                temperature: 0.5
            });
            response = completions.choices[0].text;
            console.log(response);
            // You can set the response to a state variable or display it in some way
        } catch (error) {
            console.error(error);
        }
    };
    
    const [prompt, setPrompt] = React.useState('');

    return (
        <div>
                <form className="form" 
                    onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(prompt);
                }}>

                <input
                    type="text"
                    className="form--input"
                    name="email"

                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
              
                <button type="submit" className="button-85" role="button">ask</button>
                <br/>
                <span>response : {response}</span>
            </form>
        </div>
    )
};