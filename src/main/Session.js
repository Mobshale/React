import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
} from "reactstrap";
import { Button } from "antd";
import "./session.css";
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
import {
  getAuth,
  signInWithPopup,
  getRedirectResult,
  setPersistence,
  inMemoryPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import Razorpay from "razorpay";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();
var sessionType = 0;
var user;

function Session(props) {
  const [photoURL, setPhotoUrl] = useState(null);

  auth.onAuthStateChanged((us) => {
    if (us) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      user = us;
      setPhotoUrl(user.photoURL);

      // ...
    } else {
      props.history.push("/");
    }
  });

  const logout = async () => {
    await auth.signOut();
    props.history.push("/");
  };

  const startClass = () => {
    const instance = new Razorpay({
      key_id: "rzp_live_LYHyKNT0ZiQLF5",
      key_secret: "HHq50WFLFU3ggSr6KAUCEPIu",
    });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);

    instance.subscriptions
      .create({
        plan_id: "plan_LmCI1CTXDlnROT",
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        start_at: Math.round(startDate.getTime() / 1000),
        notes: {
          key1: "value3",
          key2: "value2",
        },
      })
      .then((subscription) => {
        console.log("Subscription created:", subscription);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
      });

    // var sessionName = document.getElementById("sessionName").value;
    // sessionName = sessionName.replace(/\s+/g, "");

    // if (sessionName) {
    //   if (sessionType == 1) {
    //     props.history.push(
    //       "/guru/one2one/" +
    //         sessionName +
    //         "/" +
    //         user.displayName.trim() +
    //         "/cdox/sdoc"
    //     );
    //   } else {
    //     props.history.push(
    //       "/guru/" + sessionName + "/" + user.displayName.trim() + "/cdox/sdoc"
    //     );
    //   }
    // }
  };

  const items = [
    {
      key: "1",
      label: (
        <a target="_blank" onClick={logout}>
          Logout
        </a>
      ),
    },
  ];

  return (
    <div class="-body">
      <div className="-auth-wrapper auth-basic px-2">
        <div className="-auth-inner my-2"></div>

        <Card className="-mb-0">
          <CardBody>
            <h1 className="-title-mob">Flames</h1>

            <div class="inputBox">
              <input id="sessionName" type={"text"} required="required"></input>
              <span>Session Name</span>
            </div>

            <div class="pricing-tabs">
              <div
                class="pricing-card-free"
                id="pricing-tabs-free"
                onClick={() => {
                  document.getElementById("pricing-tabs-free").style.border =
                    "3px solid #1890FF";
                  document.getElementById(
                    "pricing-tabs-standard"
                  ).style.border = "";
                  document.getElementById("pricing-tabs-premium").style.border =
                    "";
                  sessionType = 1;
                }}
              >
                <h1>1 to 1</h1>
                <p>Class</p>
                <div class="price-free"> Free </div>
              </div>

              <div
                class="pricing-card-free"
                id="pricing-tabs-standard"
                onClick={() => {
                  document.getElementById("pricing-tabs-free").style.border =
                    "";
                  document.getElementById(
                    "pricing-tabs-standard"
                  ).style.border = "3px solid #1890FF";
                  document.getElementById("pricing-tabs-premium").style.border =
                    "";
                  sessionType = 0;
                }}
              >
                <h1>Upto 30</h1>
                <p>Participants</p>
                <div class="price-free"> Free </div>

                {/* <div class="price-standard"> ₹99/Month </div> */}
              </div>

              <div
                class="pricing-card-free"
                id="pricing-tabs-premium"
                onClick={() => {
                  document.getElementById("pricing-tabs-free").style.border =
                    "";
                  document.getElementById(
                    "pricing-tabs-standard"
                  ).style.border = "";
                  document.getElementById("pricing-tabs-premium").style.border =
                    "3px solid #1890FF";
                  sessionType = 0;
                }}
              >
                <h1>100+</h1>
                <p>Participants</p>
                <div class="price-free"> Free </div>

                {/* <div class="price-premium"> ₹499/Month </div> */}
              </div>
            </div>

            <br></br>

            <Button
              onClick={() => startClass()}
              type="primary"
              block
              size="large"
              class="btn-start-class"
            >
              Start Class
            </Button>
          </CardBody>
        </Card>

        <div className="-auth-inner-bottom"></div>
      </div>

      <div class=" id-photo">
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <Avatar
            shape="square"
            size="large"
            src={photoURL}
            referrerpolicy="no-referrer"
          />
        </Dropdown>
      </div>
    </div>
  );
}

export default Session;
