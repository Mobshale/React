import react, { useEffect, useState } from "react";
import { Popover, Tooltip, Typography } from "antd";
import { CloseOutlined, FullscreenOutlined } from "@ant-design/icons";
import "./Sharescreen.css";
import { deleteApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  get,
  child,
  update,
} from "firebase/database";
import { OpenVidu } from "openvidu-browser";
import { setCurrentScreen } from "firebase/analytics";
import axios from "axios";

var app, db, OV, session, mySession;
var once = false;

const d = new Date();
const date = ("0" + d.getDate()).slice(-2);
const month = ("0" + (d.getMonth() + 1)).slice(-2);
const time = `${date}${month}${d.getFullYear()}`;

const OPENVIDU_SERVER_URL = "https://" + "class.mobshale.com" + "";
const OPENVIDU_SERVER_SECRET = "manu";

function ShareScreen(props) {
  var roomName = props.roomName;
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  const [visible, setVisible] = useState(false);
  const [mySessionId, setSessionId] = useState(roomName + "screen");
  const [myuserName, setmyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  // const [session, setsession] = useState(undefined);
  const [mainStreamManager, setmainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    OV = new OpenVidu();
    session = OV.initSession();

    mySession = session;

    mySession.on("streamCreated", (event) => {
      // Subscribe to the Stream to receive it. Second parameter is undefined
      // so OpenVidu doesn't create an HTML video by its own
      var subscriber = mySession.subscribe(event.stream, undefined);

      //We use an auxiliar array to push the new stream
      var subs = subscribers;

      subs.push(subscriber);

      // Update the state with the new subscribers
      setSubscribers(subs);
    });

    mySession.on("streamDestroyed", (event) => {
      event.preventDefault();

      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    const getToken = async () => {
      const sessionId = await createSession(mySessionId);
      return await createToken(sessionId);
    };

    const createSession = async (sessionId) => {
      return new Promise((resolve, reject) => {
        var data = JSON.stringify({ customSessionId: sessionId });
        axios
          .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log("CREATE SESION", response);
            resolve(response.data.id);
          })
          .catch((response) => {
            var error = Object.assign({}, response);
            if (error?.response?.status === 409) {
              resolve(sessionId);
            } else {
              console.log(error);
              console.warn(
                "No connection to OpenVidu Server. This may be a certificate error at " +
                  OPENVIDU_SERVER_URL
              );
              if (
                window.confirm(
                  'No connection to OpenVidu Server. This may be a certificate error at "' +
                    OPENVIDU_SERVER_URL +
                    '"\n\nClick OK to navigate and accept it. ' +
                    'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                    OPENVIDU_SERVER_URL +
                    '"'
                )
              ) {
                window.location.assign(
                  OPENVIDU_SERVER_URL + "/accept-certificate"
                );
              }
            }
          });
      });
    };

    const createToken = (sessionId) => {
      return new Promise((resolve, reject) => {
        var data = {};
        axios
          .post(
            OPENVIDU_SERVER_URL +
              "/openvidu/api/sessions/" +
              sessionId +
              "/connection",
            data,
            {
              headers: {
                Authorization:
                  "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log("TOKEN", response);
            resolve(response.data.token);
          })
          .catch((error) => reject(error));
      });
    };

    const CalCal = () => {
      if (!once) {
        once = true;
        getToken().then((token) => {
          mySession
            .connect(token)
            .then(() => {
              console.log("coming");
              var publisher = OV.initPublisher("html-element-id", {
                videoSource: "screen",
              });

              publisher.once("accessAllowed", (event) => {
                publisher.stream
                  .getMediaStream()
                  .getVideoTracks()[0]
                  .addEventListener("ended", () => {
                    console.log('User pressed the "Stop sharing" button');
                  });
                mySession.publish(publisher);
                var video = document.getElementById("screen-video-teach");

                publisher.addVideoElement(video);
              });

              publisher.once("accessDenied", (event) => {
                console.warn("ScreenShare: Access Denied");
              });
            })
            .catch((error) => {
              console.warn(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    };
    var btn = document.getElementById("tool-headerbox-cell-screen");
    btn.addEventListener("click", CalCal);
  });

  const closeClicked = () => {
    var videoElem = document.getElementById("screen-video-teach");
    const postRef = ref(db, time + "/" + roomName + "/ss");
    set(postRef, 0);
    if (videoElem.srcObject != null) {
      let tracks = videoElem.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoElem.srcObject = null;
      // setVisible(false)
    }
    setVisible(!visible);

    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = session;

    if (mySession) {
      mySession.disconnect();
      once = false;
    }

    // Empty all properties...
    OV = null;
    session = undefined;
    setSubscribers([]);
    setPublisher(undefined);
    setmainStreamManager(undefined);
  };

  return (
    <div
      id="sharescreen"
      style={{ visibility: !visible ? "hidden" : "showing" }}
      class="sharescreen"
    >
      <div class="header-share-tab">
        <div class="close-btn" onClick={closeClicked}>
          <div class="screen-headerbox-box-cell">
            <div class="close-headerbox-cell">
              <CloseOutlined style={{ fontSize: "20px" }} />
            </div>
          </div>
        </div>
      </div>
      <div class="video-holder-div">
        <video autoPlay={true} id="screen-video-teach" class="screen-video" />
      </div>
    </div>
  );
}

export default ShareScreen;
