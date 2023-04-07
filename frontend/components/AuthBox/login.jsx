'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "next-themes";
import React from "react"
import Cookies from "universal-cookie"
import { useRouter } from 'next/navigation';

export default function Login(props) {
    const { theme, setTheme } = useTheme();

    const cookies = new Cookies();
    let router= useRouter()

    const displayEle = props.isLogin ? "block" : "none";

    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
    })

    function showAlert(mssg, mode){
        console.log("alert");

        if(mode==1)
        {
        toast.success(mssg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme,
          });
        }
        else
        {
        toast.warn(mssg, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme,
            });
        }
    }

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
            showAlert("Success", 1);
            // console.log(data.accessToken);
            // console.log(data.refreshToken);

            cookies.set("accessToken", data.accessToken);
            cookies.set("refreshToken", data.refreshToken);
            cookies.set("userName", username);

            router.push('/loggedin')
          } else {
            console.log("log in FAIL");
            console.error(data);
            showAlert(data.message, 2);
          }
    };

    return (
        <div className="form-container" style={{ display: displayEle }}>
            <form className="form" onSubmit={handleSubmit} id="loginForm">
                <div className="form-top-toggle">
                    <button className="form-switcher-enable">Login</button>
                    <span className="form-switcher-disable" onClick={props.handleClick}>Sign up</span>
                </div>
                <div className="form-inner-content">
                <input
                    type="username"
                    placeholder="username"
                    className="form--input"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                    style={{borderBottom:"2px solid red"}}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form--input"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <br/>                
                </div>
                <div className="googleButton">
                <button className="button-85" role="button" form="loginForm">Submit</button>
                </div>

            </form>

        </div>
    )
}