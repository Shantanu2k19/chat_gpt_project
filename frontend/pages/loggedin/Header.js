export default function header(prop) {
  // console.log("isVoiceChatEnabled --", prop.isVoiceChatEnabled);
  // console.log("isVoiceChatEnabled2 --", prop.speakingState);
  
  return (
    <div className="header">
      <div className="header-link">
        <a
          href="#"
          onClick={prop.switchFn}
          aria-label="social-link"
          className="mr-6 text-[#CED3F6] hover:text-primary"
        >
          <img
            alt="logout-img"
            src="/images/loggedin/options.png"
            className="option-image"
          />
        </a>
      </div>

      <div className="statusInfo">
        {!prop.isVoiceChatEnabled
          ? "Tap 💭 to enable Interactive Mode..."
          : prop.speakingState}
      </div>

      <div className="header-dot">
        <div
          className="dot"
          style={{
            backgroundColor: prop.isVoiceChatEnabled ? "rgb(16, 219, 16)" : "gray",
          }}
        ></div>
      </div>
    </div>
  );
}
