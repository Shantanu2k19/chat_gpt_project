import React from "react"
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
    const navigate = useNavigate();

    const displayEle = props.isLogin ? "block" : "none";

    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    })


    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = formData.username;
        const password = formData.password;

        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
      
          if (response.ok) {
            console.log("logged in success");
            navigate('/talkgpt');
          } else {
            const data = await response.json();
            console.log("logged in FAIL");
            console.error(data.message);
          }
    };

    return (
        <div className="form-container" style={{ display: displayEle }}>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-top-toggle">
                    <button className="form-switcher-enable">Login</button>
                    <span className="form-switcher-disable" onClick={props.handleClick}>Sign up</span>
                </div>
                <input
                    type="username"
                    placeholder="username"
                    className="form--input"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form--input"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <br></br>
                <button className="button-85" role="button">Login</button>
            </form>
        </div>
    )
}