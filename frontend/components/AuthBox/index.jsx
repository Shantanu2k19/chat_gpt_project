
'use client';
import Login from './login';
import Signup from './signup';
import React from "react"
import "../../styles/authBox.css";
import jwt from 'jwt-decode'
import Cookies from "universal-cookie"
import { useRouter } from 'next/navigation';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "next-themes";

export default function RightBox(){
    const { theme, setTheme } = useTheme();
    console.log(theme)
    const gtheme = theme==="dark"?"filled_black":"outline"
    let router= useRouter()
    const cookies = new Cookies();
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
            // console.log(data.accessToken);
            showAlert("Success", 1)

            cookies.set("accessToken", data.accessToken);
            cookies.set("refreshToken", data.refreshToken);

            router.push('/loggedin')
          }  else {
            console.log("signup FAIL");
            showAlert(data.message, 2)
            console.error(data.message);
          }
    }

    let backg = theme==="light"? "rgba(241,242,246, 0.3)":"rgba(41, 39, 39, 0.3)";
    let boxSh = theme==="light"?"0 5px 30px #dadee8":"0 5px 30px black";

    console.log(backg, boxSh);

    const loginStyle = {
        backgroundColor: backg,
        boxShadow:boxSh,
    }

    React.useEffect(() => {
        google.accounts.id.initialize({
            client_id : "293258871762-clmknpcjj0cv69slpdiognh5c041e89u.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })
    
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: gtheme, size:"large", width:"300px"}
        )
        
        // google.accounts.id.prompt();
    }, [theme]);


    return(
    <div className='login_box' style={loginStyle}>
        <div className="googleButton">
            <div id="signInDiv"></div>
        </div>

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

