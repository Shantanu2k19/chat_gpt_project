'use client';

import React from "react"
import Cookies from "universal-cookie"
import { useRouter } from 'next/navigation';

export default function Login(props) {

    const cookies = new Cookies();
    let router= useRouter()

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
        console.log("logging try")

        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json();
          if (response.ok) {
            console.log("logged in success");
            // console.log(data.accessToken);
            // console.log(data.refreshToken);

            cookies.set("accessToken", data.accessToken);
            cookies.set("refreshToken", data.refreshToken);

            router.push('/loggedin')
          } else {
            console.log("log in FAIL");
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