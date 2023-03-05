
'use client';
import Login from './login';
import Signup from './signup';
import React from "react"
import "../../styles/authBox.css";

export default function RightBox(){
    const[isLogin, setIsLogin] = React.useState(false)
    
    function toggleForm(){
        console.log(isLogin);
        setIsLogin(prevShow => !prevShow)
    }

    return(
    <div className='ayooo'>
        <Login
            handleClick={toggleForm}
            isLogin = {isLogin}
        />
        <Signup
            handleClick={toggleForm}
            isLogin = {isLogin}
        />
    </div>
    )
}

