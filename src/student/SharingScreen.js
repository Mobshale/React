import react, { useEffect, useState } from "react";
import { Popover, Tooltip, Typography } from "antd";
import { CloseOutlined, FullscreenOutlined } from "@ant-design/icons";
import "./SharingScreen.css";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";

const OPENVIDU_SERVER_URL = "https://" + "class.mobshale.com" + "";
const OPENVIDU_SERVER_SECRET = "manu";

function SharingScreen(props) {
  var roomName = props.roomName;

  const [visible, setVisible] = useState(true);
  const [mySessionId, setSessionId] = useState(roomName + "screen");
  const [myuserName, setmyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [mainStreamManager, setmainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  var OV = new OpenVidu();
  var session = OV.initSession();

  var mySession = session;

  mySession.on("streamCreated", (event) => {
    // Subscribe to the Stream to receive it. Second parameter is undefined
    // so OpenVidu doesn't create an HTML video by its own
    var subscriber = mySession.subscribe(event.stream, undefined);
    var video = document.getElementById("screen-video-stu");
    console.log(subscriber.addVideoElement(video));

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

  getToken().then((token) => {
    mySession
      .connect(token)
      .then(() => {})
      .catch((error) => {
        console.warn(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  });

  const fullScreen = () => {
    var videoElement = document.getElementById("screen-video-stu");
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) {
      /* Safari */
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
      /* IE11 */
      videoElement.msRequestFullscreen();
    }
  };

  return (
    <div
      id="sharescreen-stu"
      style={{ visibility: !visible ? "hidden" : "showing" }}
      class="sharescreen"
    >
      <div class="header-share-tab-stu">
        <div class="close-btn-stu">
          <div class="screen-headerbox-box-cell-stu">
            <div class="close-headerbox-cell-stu">
              <CloseOutlined style={{ fontSize: "20px" }} />
            </div>
          </div>
        </div>
      </div>
      <div class="header-share-tab-stu">
        <div class="fullscreen-btn-stu" onClick={fullScreen}>
          <div class="fullscreen-headerbox-box-cell-stu">
            <FullscreenOutlined style={{ fontSize: "20px" }} />
          </div>
        </div>
      </div>
      <div class="video-holder-div-stu">
        <video autoPlay={true} id="screen-video-stu" class="screen-video-stu" />
      </div>
    </div>
  );
}

export default SharingScreen;
