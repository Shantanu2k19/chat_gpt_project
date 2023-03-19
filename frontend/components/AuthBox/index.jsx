
'use client';
import Login from './login';
import Signup from './signup';
import React from "react"
import "../../styles/authBox.css";
import jwt from 'jwt-decode'
import Cookies from "universal-cookie"
import { useRouter } from 'next/navigation';

export default function RightBox(){
    let router= useRouter()
    const cookies = new Cookies();
    const[isLogin, setIsLogin] = React.useState(false)
    
    function toggleForm(){
        console.log(isLogin);
        setIsLogin(prevShow => !prevShow)
    }
    

    async function handleCallbackResponse(googResponse){
        console.log("Sigin with google");
        // console.log("encoded\n",gResponse.credential);

        var user_obj = jwt(googResponse.credential)
        console.log(user_obj);

        const email = user_obj.email;
        const username = user_obj.given_name+(user_obj.nbf)%10000;

        console.log(username);

        const gResponse = await fetch('http://localhost:5000/users/signupWithGoogle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
          });
      

          const data = await gResponse.json();
          if (gResponse.ok) {
            console.log("signup success");
            console.log(data.accessToken);

            cookies.set("accessToken", data.accessToken);
            cookies.set("refreshToken", data.refreshToken);

            router.push('/loggedin')
          }  else {
            console.log("signup FAIL");
            console.error(data.message);
          }
    }
    
    React.useEffect(() => {
        google.accounts.id.initialize({
            client_id : "293258871762-clmknpcjj0cv69slpdiognh5c041e89u.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })
    
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size:"large"}
        )
    }, []);


    return(
    <div className='ayooo'>
        
        <div id="signInDiv">

        </div>
        <br/>

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

