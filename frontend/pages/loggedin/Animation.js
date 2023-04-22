import "../../styles/animation.css";
import React, { useRef } from 'react';

export default function Animation(prop){
    const [speakingAnim, setSpeakingAnim] = React.useState(false);
  
    //voice animation
    const idleAnim = "pulsate 1.5s ease-out"
    const listenAnimation = "listening-pulse 7.5s infinite ease-in-out";
    
    const speakingAnimationOuterL = "pulse-outer-left 5s infinite ease-in-out";
    const speakingAnimationOuterR = "pulse-outer-right 5s infinite ease-in-out";
    const speakingAnimationInner = "pulse-inner 7.5s infinite ease-in-out";
  
    const [centerAnimation, setCenterAnimation] = React.useState();
    const [leftAnimation, setLeftAnimation] = React.useState();
    const [rightAnimation, setRightAnimation] = React.useState();
  
    const handleAnimation = (param) => {
      switch(param)
      {
        case 1:   //idle
          // console.log("setting IDLE")
          setSpeakingAnim(false);
          setCenterAnimation(idleAnim);
          setLeftAnimation(idleAnim);
          setRightAnimation(idleAnim);
          return;
        case 2:   //listening
        // console.log("setting LISTEN")
          StartListening();
          return;
        case 3:  //speaking
        // console.log("setting SPEAK")
          StartSpeaking();
          return;
      }
    }
  
    React.useEffect( ()=>{
      if(prop.voiceEnabled==false)
          setSpeakingAnim(false);
          
      handleAnimation(prop.currentMicState);
      console.log(prop.currentMicState)
    },[prop.currentMicState])
  
   
    function StartListening(){

      setSpeakingAnim(false);
  
      setCenterAnimation(listenAnimation);
      setLeftAnimation(listenAnimation);
      setRightAnimation(listenAnimation);
    }
  
    function StartSpeaking(){
  
      setSpeakingAnim(true);
  
      setCenterAnimation(speakingAnimationOuterL);
      setLeftAnimation(speakingAnimationInner);
      setRightAnimation(speakingAnimationOuterR);
    }
  
    const handleAnimationEnd = () => {
      // console.log('Animation completed!');
    };
  
    return (
      <>
        <div className="container">
          <div id="chatbot">
  
            {/* center div  */}
            <div 
              className="dot"
              onAnimationEnd={handleAnimationEnd}
              style={{
                animation: prop.voiceEnabled?centerAnimation:"none",
              left: prop.voiceEnabled?"-50px":"0px",
              }}
            ></div>
            {/* left  */}
            <div 
              className="dot"
              style={{
                animation: prop.voiceEnabled? leftAnimation:"none",
              }}
            ></div>
            
            {/* right  */}
            <div 
              className="dot"
              style={{
                animation: rightAnimation,
              left: prop.voiceEnabled?"50px":"0px",
              }}
            ></div>
          </div>
          
          <div id="chatbot-corner"></div>
  
          <div id="antenna"
            style={{
                height : speakingAnim? "20px":"0px",
            }}
            >
          <div id="beam"
            style={{
              display : speakingAnim? "block": "none",
          }}
          ></div>
          <div id="beam-pulsar"
            style={{
              animation : speakingAnim? "beam-pulsar-appear 1s infinite ease-in-out":"none",
              display : speakingAnim? "block": "none",
          }}
          ></div> 
          </div>
  
        </div>
  
        {/* <button onClick={() => handleAnimation(1)}>on/off</button>
        <button onClick={() => handleAnimation(2)}>startListening</button>
        <button onClick={() => handleAnimation(3)}>startSpeaking</button> */}
      </>
    );
}