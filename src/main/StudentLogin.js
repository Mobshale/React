import React, { Component, useState } from "react";
import "./main.css";
import tech from "../svg/tech.svg";
import know from "../svg/know.svg";
import logo from "../svg/logo.png";
import download from "./download.png";
import QRCode from "qrcode";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
} from "firebase/database";
import { Redirect } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  getRedirectResult,
  setPersistence,
  inMemoryPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Alert } from "antd";

var user;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

function StudentLogin(props) {
  const roomname = props.location.state.roomname;
  const sessiontype = props.location.state.sessiontype;

  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState("");

  console.log(sessiontype);

  auth.onAuthStateChanged((us) => {
    if (us) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      user = us;
      setTimeout(() => {
        // setSuccess(false);
        if (sessiontype == "one2one") {
          props.history.push(
            "/sishya/one2one/" + roomname + "/" + us.displayName + "/cdoc/sdoc"
          );
        } else {
          props.history.push(
            "/sishya/" + roomname + "/" + us.displayName + "/cdoc/sdoc"
          );
        }

        // setRedirect("/Session");
      }, 1000);
      setSuccess(true);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  const googlelogin = () => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          user = result.user;
          setTimeout(() => {
            setSuccess(false);
            if (sessiontype == "one2one") {
              props.history.push(
                "/sishya/one2one/" +
                  roomname +
                  "/" +
                  user.displayName +
                  "/cdoc/sdoc"
              );
            } else {
              props.history.push(
                "/sishya/" + roomname + "/" + user.displayName + "/cdoc/sdoc"
              );
            }
          }, 1000);
          setSuccess(true);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    });
  };

  return (
    <div>
      <div class="alert">
        {success ? (
          <Alert
            type="success"
            showIcon
            message={"Successful loged in as " + user.email}
          ></Alert>
        ) : null}
      </div>

      <div className="auth-wrapper auth-basic px-2">
        <div className="auth-inner my-2"></div>

        <Card className="mb-0">
          <CardBody>
            <h1 className="title-mob">Mobshale</h1>
            <h3 class="welcome-txt">Welcome to Mobshale! 👋</h3>
            <p class="welcome-info">
              Please sign-in to your account to join the class
            </p>

            <div class="gg-btn" onClick={() => googlelogin()}>
              <button type="button" class="google-btn">
                <span class="v-btn">
                  <img
                    src="https://web.wise.live/svgs/icon/login/google.svg"
                    class="mr-3"
                  ></img>
                  Continue with Google
                </span>
              </button>
            </div>

            <div class="pp-btn">
              <button type="button" class="phone-btn">
                <span class="v-btn">
                  <img
                    src="https://web.wise.live/svgs/icon/login/phone.svg"
                    class="mr-3"
                  ></img>
                  Continue with Phone Number
                </span>
              </button>
            </div>

            <div class="or--">
              <div class="line-single"></div>
            </div>

            {/* <p class="scan-text">
              Scan the QR code from mobshale app to login instantly!
            </p>
            <div>
              <canvas
                id="qr-canvas"
                class="qr-canvas"
                style={{ width: "360px", height: "300px" }}
              ></canvas>
            </div> */}
          </CardBody>
        </Card>

        <div className="auth-inner-bottom"></div>
      </div>
    </div>
  );
}

export default StudentLogin;
