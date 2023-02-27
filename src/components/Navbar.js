import React, { useRef, useEffect } from "react";

export default function Navbar(){
    const [val, setVal] = React.useState("1");

    useEffect(() => {
        setVal(2);
        console.log(val);
      },[]);
    
    


    return(
        <nav className="header">
            <img alt="maneyyy" src = "images/Animation.gif" className = "navbar--logo" />
            <h2 className="navbar--title">{val}</h2>
        </nav>
    )
}
