import "../../styles/animation.css";
import React, { useRef } from 'react';

export default function Animation(){
    const [voiceEnabled, setVoiceEnabled] = React.useState(false);
    const [listeningAnim, setListeningAnim] = React.useState(false);
    const [speakingAnim, setSpeakingAnim] = React.useState(false);
  
    //voice animation
    const listenAnimation = "listening-pulse 7.5s infinite ease-in-out";
    
    
    const speakingAnimationOuterL = "pulse-outer-left 5s infinite ease-in-out";
    const speakingAnimationOuterR = "pulse-outer-right 5s infinite ease-in-out";
    const speakingAnimationInner = "pulse-inner 7.5s infinite ease-in-out";
  
    const centerCirc = ""
  
  
    const dotAnimRef = useRef(null);
  
    const [centerAnimation, setCenterAnimation] = React.useState();
    const [leftAnimation, setLeftAnimation] = React.useState();
    const [rightAnimation, setRightAnimation] = React.useState();
  
    const handleAnimation = (param) => {
      switch(param)
      {
        case 1:
          voiceEnabled? console.log("turning off"): console.log("turining ONN");
          if(voiceEnabled)
          {
              setVoiceEnabled(false);
              setListeningAnim(false);
              setSpeakingAnim(false);
          }
          else
          {
              setVoiceEnabled(true);
              setListeningAnim(false);
              setSpeakingAnim(false);
          }
          return;
        case 2:
          console.log("Start listening");
          StartListening();
          return;
        case 3:
          console.log("start speaking");
          StartSpeaking();
          return;
      }
    }
  
  
   
    function StartListening(){
  
      if(!voiceEnabled) setVoiceEnabled(true);
  
      setListeningAnim(true);
      setSpeakingAnim(false);
  
      setCenterAnimation(listenAnimation);
      setLeftAnimation(listenAnimation);
      setRightAnimation(listenAnimation);
    }
  
    function StartSpeaking(){
      if(!voiceEnabled) setVoiceEnabled(true);
  
      setSpeakingAnim(true);
      setListeningAnim(false);
  
      setCenterAnimation(speakingAnimationOuterL);
      setLeftAnimation(speakingAnimationInner);
      setRightAnimation(speakingAnimationOuterR);
    }
  
    const handleAnimationEnd = () => {
      console.log('Animation completed!');
    };
  
    return (
      <>
        <div className="container">
          <div id="chatbot">
  
            {/* center div  */}
            <div 
              ref={dotAnimRef} 
              className="dot"
              onAnimationEnd={handleAnimationEnd}
              style={{
                animation: voiceEnabled?centerAnimation:"none",
              left: voiceEnabled?"-50px":"0px",
              }}
            ></div>
            {/* left  */}
            <div 
              className="dot"
              style={{
                animation: voiceEnabled? leftAnimation:"none",
              }}
            ></div>
            
            {/* right  */}
            <div 
              className="dot"
              style={{
                animation: rightAnimation,
              left: voiceEnabled?"50px":"0px",
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