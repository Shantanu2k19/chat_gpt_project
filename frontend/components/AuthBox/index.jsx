
'use client';
import Login from './login';
import Signup from './signup';
import GoogleLogin from "./googleLogin";
import React from "react"
import "../../styles/authBox.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTheme } from "next-themes";

export default function RightBox(){    
  const { theme, setTheme } = useTheme();
    const[isLogin, setIsLogin] = React.useState(false)
    
    function toggleForm(){
        console.log(isLogin);
        setIsLogin(prevShow => !prevShow)
    }

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

    return(
    <div className='rounded-md bg-primary bg-opacity-5 py-10 px-6 dark:bg-dark sm:p-[60%]' style={{padding:"3%"}}>
        <div className="googleButton">
            <div id="signInDiv"></div>
        </div>


        <GoogleLogin 
            showAlert = {showAlert}
            theme = {theme}
        />

        <hr className="line-overkill"/>
        
        <Login
            handleClick={toggleForm}
            isLogin = {isLogin}
            theme = {theme}
        />
        <Signup
            handleClick={toggleForm}
            isLogin = {isLogin}
        />
    </div>
    )
}

