import React from "react";
import "../../styles/togswitch.css";

const ToggleSwitch = (prop) => {
  // const isGoog = useRef(null);

  // React.useEffect(() => {

  //   const inputElement = isGoog.current;
  //   if (prop.isGoogleVoice) {
  //     inputElement.checked = true;
  //   }
  //   else{

  //   }

  // }, [])

  return (
    <div className="container">
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="checkbox"
          name="genable"
          id="genable"
          checked = {prop.isGoogleVoice}
          onChange={(event) => {
            event.target.checked
              ? prop.setIsGoogleVoice(true)
              : prop.setIsGoogleVoice(false);
          }}
        />
        <label className="label" htmlFor="genable">
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
