import Login from './Login';
import Signup from './Signup';
import React from "react"

export default function RightBox(){
    const[isLogin, setIsLogin] = React.useState(false)
    
    function toggleForm(){
        console.log(isLogin);
        setIsLogin(prevShow => !prevShow)
    }

    return(
    <div>
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