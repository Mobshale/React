import Canvaboard from "../whiteboard/canvaboard";
import React, { Component } from "react";
import "../whiteboard/presentervideo.css";
import { Button } from "antd";

class Presentervideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
    };
  }

  componentDidMount() {
    this.getLocalStream();
  }

  getLocalStream = () => {
    // const success = (stream) => {
    //   window.localStream = stream
    //   this.setState({
    //     localStream: stream
    //   })
    // var video = document.querySelector("video2");
    // // video.srcObject = this.state.localStream
    // this.props.childToParent(video);
    // }
    // const failure = (e) => {
    //   console.log('getUserMedia Error: ', e)
    // }
    // const constraints = {
    //   audio: true,
    //   video: true,
    //   options: {
    //     mirror: true,
    //   }
    // }
    // navigator.mediaDevices.getUserMedia(constraints)
    //   .then(success)
    //   .catch(failure)
  };

  render() {
    return (
      <div class="presenter-box">
        {/* <video autoPlay={true} id='video2'  class="video2"/> */}
        <video
          class="presentervideo"
          autoPlay={true}
          playsInline
          id="presentervideo"
        ></video>
      </div>
    );
  }
}

export default Presentervideo;
