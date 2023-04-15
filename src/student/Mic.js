import React, { useState, useEffect } from "react";
import { Button, Image } from "antd";
import { MContext } from "../whiteboard/MyProvider";
import { AudioMutedOutlined, AudioOutlined } from "@ant-design/icons";
function MuteButton() {
  const [isMuted, setIsMuted] = useState(true);
  const [stream, setStream] = useState(null);

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    async function getStream() {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setStream(audioStream);
      } catch (error) {
        console.log(error);
      }
    }
    getStream();
  }, []);

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
          onClick={() => toggleMute()}
        >
          <Button
            type="text"
            style={{ padding: 0, backgroundColor: "#FFFFFF" }}
            className="mute-button"
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
