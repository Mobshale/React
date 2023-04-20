import React, { useState, useEffect } from "react";
import { Button, Image } from "antd";
import { MContext } from "../whiteboard/MyProvider";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";
function MuteButton({ msg }) {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    msg(isMuted);
  };

  return (
    <MContext.Consumer>
      {(context) => (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            width: "80px",
            height: "80px",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: "999",
            boxShadow: "0 8px 24px 0 rgb(0 0 0 / 10%)",
            borderRadius: "4px",
            paddingBottom: "20px",
          }}
        >
          <Button
            type="text"
            style={{ padding: 0, backgroundColor: "#FFFFFF" }}
            className="mute-button"
            onClick={() => toggleMute()}
          >
            {isMuted ? (
              <>
                <AudioMutedOutlined style={{ fontSize: "30px" }} />
                <div style={{ marginTop: "5px" }}>Muted</div>
              </>
            ) : (
              <>
                <AudioOutlined style={{ fontSize: "30px" }} />
                <div style={{ marginTop: "5px" }}>Unmuted</div>
              </>
            )}
          </Button>
        </div>
      )}
    </MContext.Consumer>
  );
}

export default MuteButton;
