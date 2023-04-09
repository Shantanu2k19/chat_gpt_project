import React from "react";
import "../../styles/settingsTog.css";
import { useRef } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function settings(prop) {
  const rateRef = useRef(null);
  const pitchRef = useRef(null);
  const voiceRef = useRef(null);

  function resetVals() {
    setIsGoogleVoice(false);

    const inputElement = rateRef.current;
    if (inputElement) {
      inputElement.value = "1";
    }
    prop.setRate(1);

    const inputElement2 = pitchRef.current;
    if (inputElement2) {
      inputElement2.value = "1";
    }
    prop.setPitch(1);

    const inputElement3 = voiceRef.current;
    if (inputElement3) {
      inputElement3.value = "0";
    }
    prop.setVoiceIndex(0);
  }

  const [isGoogleVoice, setIsGoogleVoice] = React.useState(true);


  function googlePressed(){

  }

  return (
    <div
      className="globalDiv"
      style={prop.stnPopup ? { top: "245px" } : { top: "-400px" }}
    >
      <strong style={{ padding: "20px" }}>Speech Synthesis Settings</strong>
      <hr style={{ width: "80%", color: "rgba(126, 126, 126, 0.423)" }} />

      <div className="wrapper">
        <div className="settingForm" style={ isGoogleVoice ? {} : { backgroundColor: "rgba(174, 174, 174, 0.176"}}>

          {!prop.supported && (
            <p>
              Oh no, it looks like your browser doesn't support Speech
              Synthesis.
            </p>
          )}

          {prop.supported && (
            <React.Fragment>
              <div className="threeDiv">
                <div className="left-Div">
                  <label htmlFor="voice">Voice</label>
                </div>
                <div className="right-div">
                  <select
                    id="voice"
                    name="voice"
                    value={prop.voiceIndex || ""}
                    onChange={(event) => {
                      prop.setVoiceIndex(event.target.value);
                      console.log(prop.voiceIndex);
                    }}
                    ref={voiceRef}
                    className="selectClass"
                  >
                    <option value="">Default</option>
                    {prop.voices.map((option, index) => (
                      <option key={option.voiceURI} value={index}>
                        {`${option.lang} - ${option.name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="threeDiv">
                <div className="left-Div">
                  <label htmlFor="rate">Rate </label>
                </div>
                <div className="right-div" style={{ width: "50%" }}>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    defaultValue="1"
                    step="0.1"
                    id="rate"
                    onChange={(event) => {
                      prop.setRate(event.target.value);
                      setIsGoogleVoice(false);
                    }}
                    ref={rateRef}
                    className="silderClass"
                  />
                </div>
                <div className="right-div" style={{ width: "10%" }}>
                  {prop.rate}
                </div>
              </div>

              <div className="threeDiv">
                <div className="left-Div">
                  <label htmlFor="pitch">Pitch </label>
                </div>
                <div className="right-div" style={{ width: "50%" }}>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    defaultValue="1"
                    step="0.1"
                    id="pitch"
                    onChange={(event) => {
                      prop.setPitch(event.target.value);
                      setIsGoogleVoice(false);
                    }}
                    ref={pitchRef}
                    className="silderClass"
                    style={{}}
                  />
                </div>

                <div className="right-div" style={{ width: "10%" }}>
                  {prop.pitch}
                </div>
              </div>

              <div className="threeDiv" style={{ height: "40px" }}>
                <div className="left-Div"></div>

                <div className="right-div">
                  <button className="button-17" onClick={resetVals}>
                    Reset
                  </button>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* <hr style={{ width: "80%", color: "rgba(126, 126, 126, 0.423)" }} /> */}
<br />

        <div className="aivoice" style={ isGoogleVoice ? { backgroundColor: "rgba(174, 174, 174, 0.176"} : {} }>
          <div className="aivoice-top">Ai generated voice sound beterr</div>
          <div className="aivoice-bottom">
            <ToggleSwitch 
              setIsGoogleVoice={setIsGoogleVoice}
              isGoogleVoice = {isGoogleVoice}
            />
          </div>
        </div>

<br />
        <div className="threeDiv" style={{ height: "40px" }}>
          <div className="right-div">
            <button className="button-17" onClick={prop.testSpeach}>
              Test
            </button>
          </div>

          <div className="right-div">
            <button className="button-17">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
