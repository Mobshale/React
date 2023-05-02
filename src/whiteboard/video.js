import { useEffect, useRef } from "react";
import Canvaboard from "../whiteboard/canvaboard";
import "./video.css";
import { Button } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

function Video(props) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    props.childToParent(video);
  }, [props]);

  return (
    <div className="video-box">
      <video
        autoPlay={true}
        id="video"
        ref={videoRef}
        className="video"
        muted={props.muted}
      />
      <div className="video-bar">
        <Button
          onClick={props.toggleMute}
          icon={props.muted ? <AudioMutedOutlined /> : <AudioOutlined />}
        >
          {/* {props.muted ? "Unmute" : "Mute"} */}
        </Button>
        <Button
          onClick={props.toggleVideo}
          icon={props.videoOn ? <AudioOutlined /> : <VideoCameraOutlined />}
        ></Button>
      </div>
    </div>
  );
}

export default Video;
