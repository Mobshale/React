import "../whiteboard/presentervideo.css";
import React, { useRef, useState } from "react";

function Presentervideo() {
  const pos = getXYPosition(36.5, 45);
  const [position, setPosition] = useState({ x: pos.x, y: pos.y });
  const videoRef = useRef(null);

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
        className="presentervideo"
        autoPlay={true}
        playsInline
        id="presentervideo"
      ></video>
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
