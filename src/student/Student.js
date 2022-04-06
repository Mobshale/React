import Canvaboard from "../whiteboard/canvaboard";
import React, { Component } from 'react';
import Header from "../whiteboard/header";
import Video from "./studentvideo";
import "../whiteboard/video.css"
import Chat from "../whiteboard/Chat";
import MyProvider from "../whiteboard/MyProvider";
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import PropagateLoader from "react-spinners/PropagateLoader";
import { css } from "@emotion/react";



var roomN
var userN
var reren =0;



const OPENVIDU_SERVER_URL = 'https://' + "video.mobshale.com" + '';
const OPENVIDU_SERVER_SECRET = 'manuvini';

class Student extends React.Component {

  constructor(props){
    super(props)
    const { userName } = this.props.match.params;
    const { roomName } = this.props.match.params;
    roomN = roomName
    userN = userName


    this.state = {
      mySessionId: roomN,
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      preloader : true,

  };



  this.joinSession = this.joinSession.bind(this);
  this.leaveSession = this.leaveSession.bind(this);
  // this.switchCamera = this.switchCamera.bind(this);
  this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
  this.handleChangeUserName = this.handleChangeUserName.bind(this);
  this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
  this.onbeforeunload = this.onbeforeunload.bind(this);





  }

    
  childToParent = (video) => {

  }


  componentDidMount() {
    this.joinSession();

    if(reren===0){
        setTimeout(() => {
        var x = document.getElementById('preload');
        x.style.display = "none";
        this.setState({
          preloader : false 
        })
      }, 5000)
    }


  }
 
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
        mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
      this.setState({
          myUserName: e.target.value,
      });
  }

  handleMainVideoStream(stream) {
      if (this.state.mainStreamManager !== stream) {
          this.setState({
              mainStreamManager: stream
          });
      }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
        subscribers.splice(index, 1);
        this.setState({
            subscribers: subscribers,
        });
    }
}


joinSession() {
  // --- 1) Get an OpenVidu object ---

  this.OV = new OpenVidu();

  // --- 2) Init a session ---
  console.log("heyyyy")

  this.setState(
      {
          session: this.OV.initSession(),
      },
      () => {
          var mySession = this.state.session;

          // --- 3) Specify the actions when events take place in the session ---

          // On every new Stream received...
          mySession.on('streamCreated', (event) => {
              // Subscribe to the Stream to receive it. Second parameter is undefined
              // so OpenVidu doesn't create an HTML video by its own
              console.log("brooo")
              console.log(event.stream);
              var subscriber = mySession.subscribe(event.stream, undefined);
              var subscribers = this.state.subscribers;
              var video = document.getElementById('video2');
              subscriber.addVideoElement(video);
              
              subscribers.push(subscriber);

              console.log("hell baby")

              // Update the state with the new subscribers
              this.setState({
                  subscribers: subscribers,
              });
          });

          // On every Stream destroyed...
          mySession.on('streamDestroyed', (event) => {
              // Remove the stream from 'subscribers' array
              this.deleteSubscriber(event.stream.streamManager);
          });

          // On every asynchronous exception...
          mySession.on('exception', (exception) => {
              console.warn(exception);
          });

          // --- 4) Connect to the session with a valid user token ---

          // 'getToken' method is simulating what your server-side should do.
          // 'token' parameter should be retrieved and returned by your own backend
          this.getToken().then((token) => {
              // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
              // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
              mySession
                  .connect(
                      token,
                      { clientData: this.state.myUserName },
                  )
                  .then(async () => {
                      // var devices = await this.OV.getDevices();
                      // var videoDevices = devices.filter(device => device.kind === 'videoinput');
                      // console.log(videoDevices);

                      // // --- 5) Get your own camera stream ---

                      // // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                      // // element: we will manage it on our own) and with the desired properties
                      // let publisher = this.OV.initPublisher(undefined, {
                      //     audioSource: undefined, // The source of audio. If undefined default microphone
                      //     videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                      //     publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                      //     publishVideo: true, // Whether you want to start publishing with your video enabled or not
                      //     resolution: '640x480', // The resolution of your video
                      //     frameRate: 30, // The frame rate of your video
                      //     insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                      //     mirror: false, // Whether to mirror your local video or not
                      // });

                      // // --- 6) Publish your stream ---

                      // mySession.publish(publisher);
                      

                      

                      // // Set the main video in the page to display our webcam and store our Publisher
                      // this.setState({
                      //     currentVideoDevice: videoDevices[0],
                      //     mainStreamManager: publisher,
                      //     publisher: publisher,
                      // });
                  })
                  .catch((error) => {
                      console.log('There was an error connecting to the session:', error.code, error.message);
                  });
          });
      },
  );
}


leaveSession() {

  // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

  const mySession = this.state.session;

  if (mySession) {
      mySession.disconnect();
  }

  // Empty all properties...
  this.OV = null;
  this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined
  });
}




  
  


  render(){
    const preloader = this.state.preloader;
    const override = css`
    display: flex;
    top: 45%;
      `;
  
  return (
   <div>
     <MyProvider>
          <div  id='preload' class="preload">
          <PropagateLoader class="loader" color={"#010529"} loading={preloader}  css={override} size={20} />
        </div>
        <Header></Header>
        {/* <div id="video-box" class="video-box"> */}
       {/* <video autoPlay={true} id='video2'  class="video2"/> */}

        {/* <video 
         class="video2"  id='video2'>
        </video>  */}
      {/* </div> */}
        <Video childToParent={(v) =>this.childToParent(v)} ></Video>
        <Chat  userName={userN}  roomName={roomN}></Chat>
        <Canvaboard message="none" roomName={roomN} type="0"> </Canvaboard>
     </MyProvider>
     
   </div>

  );
  }

  
  
    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
     *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
     *   3) The Connection.token must be consumed in Session.connect() method
     */

     getToken() {
      return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
  }

  createSession(sessionId) {
      return new Promise((resolve, reject) => {
          var data = JSON.stringify({ customSessionId: sessionId });
          axios
              .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                  headers: {
                      Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                      'Content-Type': 'application/json',
                  },
              })
              .then((response) => {
                  console.log('CREATE SESION', response);
                  resolve(response.data.id);
              })
              .catch((response) => {
                  var error = Object.assign({}, response);
                  if (error?.response?.status === 409) {
                      resolve(sessionId);
                  } else {
                      console.log(error);
                      console.warn(
                          'No connection to OpenVidu Server. This may be a certificate error at ' +
                          OPENVIDU_SERVER_URL,
                      );
                      if (
                          window.confirm(
                              'No connection to OpenVidu Server. This may be a certificate error at "' +
                              OPENVIDU_SERVER_URL +
                              '"\n\nClick OK to navigate and accept it. ' +
                              'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                              OPENVIDU_SERVER_URL +
                              '"',
                          )
                      ) {
                          window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                      }
                  }
              });
      });
  }

  createToken(sessionId) {
      return new Promise((resolve, reject) => {
          var data = {};
          axios
              .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
                  headers: {
                      Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                      'Content-Type': 'application/json',
                  },
              })
              .then((response) => {
                  console.log('TOKEN', response);
                  resolve(response.data.token);
              })
              .catch((error) => reject(error));
      });
  }
    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * These methods retrieve the mandatory user token from OpenVidu Server.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
     * the API REST, openvidu-java-client or openvidu-node-client):
     *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
     *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
     *   3) The Connection.token must be consumed in Session.connect() method
     */

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error?.response?.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = {};
            axios
                .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    


  
  
    }
  


}






export default Student;
