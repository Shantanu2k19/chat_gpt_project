import React from "react"
import { useNavigate } from 'react-router-dom';

export default function Signup(props) {
    const navigate = useNavigate();

    const displayEle = props.isLogin ? "none" : "block";

    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: "",
        passwordconfirm: ""
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

        if (formData.password !== formData.passwordconfirm) {
            console.log("passwords do not match !!");
            return;
        }

        const email = formData.email;
        const username = formData.username;
        const password = formData.password;

        const response = await fetch('http://localhost:5000/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
          });
      
          if (response.ok) {
            console.log("signup success");
            navigate('/talkgpt');
          } else {
            const data = await response.json();
            console.log("signup in FAIL");
            console.error(data.message);
          }
    };

    return (
        <div className="form-container" style={{ display: displayEle }}>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-top-toggle">
                    <span className="form-switcher-disable" onClick={props.handleClick} >Login</span>
                    <span className="form-switcher-enable">Sign up</span>
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
                    type="email"
                    placeholder="Email address"
                    className="form--input"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form--input"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <input
                    type="password"
                    placeholder="Re-enter Password"
                    className="form--input"
                    name="passwordconfirm"
                    onChange={handleChange}
                    value={formData.passwordconfirm}
                />
                <br></br>
                <button className="button-85">Sign Up</button>
                <br/>
            </form>

        </div>
    )
}