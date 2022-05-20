import Canvaboard from "../whiteboard/canvaboard";
import React, { Component } from 'react';
import "../whiteboard/video.css"
import { Button } from "antd";

class Video extends React.Component {

  constructor(props){
    super(props)

    

    this.state = {
        localStream : null
    }
   
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
      var video = document.querySelector('video2');
      // video.srcObject = this.state.localStream
      this.props.childToParent(video);
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
  }
  


  render(){
  
  return (
   <div class="video-box">
       {/* <video autoPlay={true} id='video2'  class="video2"/> */}

        <video 
         class="video2"  autoPlay={true}  playsInline  id='video2'>
        </video> 
     
   </div>

  );
  }
  
}

export default Video;
