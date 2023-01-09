import React, { Component } from "react";
import "./main.css";
import tech from "../svg/tech.svg";
import know from "../svg/know.svg";
import logo from "../svg/logo.png";
import download from "./download.png";
import QRCode from "qrcode";
import { initializeApp } from "firebase/app";
import logomobile from "../img/logo/Flames-mob-logo.png";
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

var qrcode;
var fcode;
var user;
var isMobile = false;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = { redirect: null, success: false };

    const userAgent = window.navigator.userAgent;
    const mobileAgents = ["Android", "iPhone", "iPad", "iPod"];
    isMobile = mobileAgents.some((agent) => userAgent.includes(agent));

    auth.onAuthStateChanged((us) => {
      if (us) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        user = us;
        setTimeout(() => {
          this.setState({
            success: false,
            redirect: "/Session",
          });
        }, 1000);
        this.setState({
          success: true,
        });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  componentDidMount() {
    if (!isMobile) {
      var canvas = document.getElementById("qr-canvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFF";
      ctx.fillRect(0, 0, 500, 500);
      qrcode = makeid(120);
      QRCode.toCanvas(canvas, qrcode, function (error) {
        if (error) console.error(error);
        console.log("success!");
      });
      fcode = qrcode.slice(0, 15);

      const d = new Date();
      var date = "" + d.getDate();
      if (date.length === 1) {
        date = "0" + date;
      }
      var month = "" + (d.getMonth() + 1);
      if (month.length === 1) {
        month = "0" + month;
      }
      var time = "" + date + month + d.getFullYear();
      console.log(date);

      set(ref(db, "/" + time + "/" + fcode), {
        t: 0,
      });

      const postListRef = ref(db, "/" + time + "/" + fcode);
      // console.log(postListRef);
      onValue(postListRef, (snapshot) => {
        var kt = snapshot.val();
        if (kt.t === 1) {
          this.setState({
            redirect:
              "/guru/" + kt.c + "/" + kt.n + "/" + kt.cdoc + "/" + kt.sdoc,
          });
        } else if (kt.t === 2) {
          this.setState({
            redirect:
              "/sishya/" + kt.c + "/" + kt.n + "/" + kt.cdoc + "/" + kt.sdoc,
          });
        }
      });
    }
  }

  googlelogin = () => {
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
            this.setState({
              success: false,
              redirect: "/Session",
            });
          }, 1000);
          this.setState({
            success: true,
            // redirect: "/Session"
          });

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

  // creatAcc = () => {

  // }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div class="body">
        {isMobile ? (
          <div className="mobile-prompt">
            <div className="mobile-prompt-content">
              <img src={logomobile} alt="Mobile icon" />
              <h1>Download Flames Mobile App</h1>
              <p>
                Experience the best of Flames on the go with our mobile app.
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.mobshale.app"
                className="btn"
              >
                Download Now
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div class="alert">
              {this.state.success ? (
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
                    Please sign-in to your account and start the adventure
                  </p>

                  <div class="gg-btn" onClick={() => this.googlelogin()}>
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
                    <div class="line-single"></div>&nbsp; or &nbsp;
                    <div class="line-single2"></div>
                  </div>

                  <p class="scan-text">
                    Scan the QR code from mobshale app to login instantly!
                  </p>

                  <div>
                    <canvas
                      id="qr-canvas"
                      class="qr-canvas"
                      style={{ width: "360px", height: "300px" }}
                    ></canvas>
                  </div>
                </CardBody>
              </Card>

              <div className="auth-inner-bottom"></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default Main;

{
  /* 
       <div class="center">

          <div class="white_bac">
            <h1 class="t1">Welcome Back!</h1>
            <h4 class='t2'>We're so excited to see you again</h4>

            <br></br>
            <br></br>
            <br></br>
            <button type="button" class="text--16 height-48 mb-2 v-btn v-btn--block v-btn--outlined theme--light v-size--large">
              <span class="v-btn__content">
                <img src="/svgs/icon/login/google.svg" class="mr-3"></img>
              Continue with Google
            </span></button>
            
            <h2 class='t3'>
              You're just one step closer to join the class.
              Scan the code to enter the class. Happy class!
            </h2>

          </div>
          
           <div class="white_bac2">
             <div>
             <canvas id="canvas" style={{width:'360px', height:'300px'}}></canvas>
             </div>
           <h2 class="t1">Login in with QR Code</h2>
           <p class='t2'>Scan this with the <strong>Mobshale mobile app</strong> to join instantly.</p>
           </div>

        

           
       </div> */
}
