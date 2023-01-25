import "../whiteboard/presentervideo.css";
import React, { useRef, useState } from "react";
import MyProvider from "../whiteboard/MyProvider";
import MuteSvg from "../svg/mute.svg";
import UnMuteSvg from "../svg/unmute.svg";
import VideoOn from "../svg/videoon.svg";
import VideoOff from "../svg/videooff.svg";

function Presentervideo() {
  const pos = getXYPosition(36.5, 45);
  const [position, setPosition] = useState({ x: pos.x, y: pos.y });
  const videoRef = useRef(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const localVideoRef = useRef(null);

  const handleMouseDown = (event) => {
    const initialX = event.clientX - position.x;
    const initialY = event.clientY - position.y;

    const handleMouseMove = (event) => {
      console.log(event.clientX, event.clientY);
      setPosition({
        x: event.clientX - initialX,
        y: event.clientY - initialY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
  };

  const toggleAudio = () => {
    const localVideo = localVideoRef.current;
    if (micEnabled) {
      localVideo.srcObject.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = false;
        }
      });
    } else {
      localVideo.srcObject.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = true;
        }
      });
    }
    setMicEnabled(!micEnabled);
  };

  const toggleVideo = () => {
    const localVideo = localVideoRef.current;
    if (videoEnabled) {
      localVideo.srcObject.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = false;
        }
      });
    } else {
      localVideo.srcObject.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = true;
        }
      });
    }
    setVideoEnabled(!videoEnabled);
  };

  return (
    <div
      className="presenter-box"
      ref={videoRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 999,
      }}
    >
      <video
        ref={localVideoRef}
        className="presentervideo"
        autoPlay={true}
        playsInline
        id="presentervideo"
      ></video>
      <img src={micEnabled ? MuteSvg : UnMuteSvg} onClick={toggleAudio}></img>
      <img src={videoEnabled ? VideoOn : VideoOff} onClick={toggleVideo}></img>
    </div>
  );
}

function getXYPosition(percentageFromRight, fixedPixelValue) {
  // Get the width of the parent element
  const parentWidth = document.body.offsetWidth;
  // Calculate the x position by subtracting the percentage from 100
  const x = ((100 - percentageFromRight) / 100) * parentWidth;
  // Set the y position as the fixed pixel value
  const y = fixedPixelValue;
  return { x: x, y: y };
}

export default Presentervideo;
