import React, { useState, useEffect } from "react";
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
import { Alert } from "antd";
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
import axios from "axios";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
var dbfirestore = getFirestore();
const auth = getAuth();
var sessionType = 0;
var user;

function Session(props) {
  const [photoURL, setPhotoUrl] = useState(null);
  const [planId, setPlanId] = useState("plan_LmCI1CTXDlnROT");
  const [customerId, setCustomerId] = useState("11");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscibed] = useState(false);
  const [classPlan, setClassPlan] = useState(0);
  const [chargable, setChargable] = useState(14.99);
  const [notify, setNotify] = useState("");

  var userRef;

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((us) => {
      user = us;
      if (us) {
        setCustomerId(us.uid);
        setPhotoUrl(us.photoURL);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    dbfirestore = getFirestore();
    const userRef = doc(dbfirestore, "users", customerId);
    getDoc(userRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log(userData);
          if (userData.isPremium === true) {
            setSubscibed(true);
          }
        }
      })
      .catch((error) => {
        console.log("Error retrieving user data:", error);
      });
  }, [customerId]);

  const logout = async () => {
    await auth.signOut();
    props.history.push("/");
  };

  useEffect(() => {
    // Include the Razorpay SDK script in the document head
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const nextPage = (sessionName) => {
    if (sessionType == 1) {
      props.history.push(
        "/guru/one2one/" +
          sessionName +
          "/" +
          user.displayName.trim() +
          "/cdox/sdoc"
      );
    } else {
      props.history.push(
        "/guru/" + sessionName + "/" + user.displayName.trim() + "/cdox/sdoc"
      );
    }
  };

  const startRazor = async (sessionName) => {
    let planeName = "";
    switch (classPlan) {
      case 2:
        setPlanId("plan_LuEqm4rnOJqq2W");
        setChargable(9.99);
        planeName = "7 days free trial- Later ₹999/Montly";
        break;
      case 3:
        setPlanId("plan_LuEpJyqMRz73OV");
        setChargable(14.99);
        planeName = "7 days free trial- Later ₹1499/Montly";
        break;
    }

    try {
      setNotify("Please wait we are processing");
      setTimeout(() => {
        setNotify("");
      }, 4000);

      const response = await axios.post(
        "https://flamesrazrorpay.azurewebsites.net/api/HttpTrigger1?code=Hq7XEiKFvfH6S35JKkYeM3JzVH9HS8UXByu1-68kavupAzFub7ZiaA==",
        {
          planId: planId,
          customerId: customerId,
        }
      );

      console.log(response.data);

      const { id: subscriptionId, short_url: razorpayShortUrl } = response.data;
      setSubscriptionId(subscriptionId);
      setError("");
      const orderId = razorpayShortUrl.substring(
        razorpayShortUrl.lastIndexOf("/") + 1
      );

      const options = {
        key: "rzp_live_LYHyKNT0ZiQLF5",
        subscription_id: subscriptionId,
        name: planeName,
        description: "Monthly Subscription",
        image:
          "https://lh3.googleusercontent.com/a/AEdFTp5Q0-gTVHJNEJrusQef_neBPJMhkREZn3F_jAm-OA=s96-c", // URL of the logo image
        handler: function (response) {
          console.log(response);
          // Handle success
          userRef
            .set({
              isPremium: true,
            })
            .then(() => {
              console.log("User is now a premium user.");
              setSubscibed(true);
            })
            .catch((error) => {
              console.log("Error creating/updating user profile:", error);
            });
          nextPage(sessionName);
        },
        modal: {
          ondismiss: function () {
            console.log("Payment window closed"); // Handle cancellation
          },
        },
        notes: {
          trialNote:
            "After the free trial, $" + chargable + " will be charged.", // Additional note
        },
      };

      // Extract the order ID from the short URL

      console.log(orderId);
      // Append the order ID to the options object

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError("An error occurred while creating the subscription.");
      setSubscriptionId("");
    }
  };

  const startClass = async () => {
    var sessionName = document.getElementById("sessionName").value;
    sessionName = sessionName.replace(/\s+/g, "");

    if (sessionName) {
      switch (classPlan) {
        case 0:
          setError("Please select the session plan");
          setTimeout(() => {
            setError("");
          }, 2000);

          break;
        case 1:
          nextPage(sessionName);
          break;
        case 2:
          if (subscribed) {
            nextPage(sessionName);
          } else {
            startRazor(sessionName);
          }
          break;
        case 3:
          if (subscribed) {
            nextPage(sessionName);
          } else {
            startRazor(sessionName);
          }
          break;
      }
    } else {
      setError("Please Enter the session name");
      setTimeout(() => {
        setError("");
      }, 2000);
    }

    // try {
    //   const response = await axios.post("http://localhost:3001/create-order");
    //   const orderId = response.data.orderId;
    //   console.log("Order ID:", orderId);

    //   // Call the Razorpay checkout function
    //   const options = {
    //     key: "rzp_live_LYHyKNT0ZiQLF5", // Replace with your Razorpay API key
    //     amount: 100, // Amount in paise (e.g., 50000 paise = ₹500)
    //     currency: "INR",
    //     name: "My Store",
    //     description: "Test Order",
    //     order_id: orderId,
    //     handler: function (response) {
    //       console.log("Payment ID:", response.razorpay_payment_id);
    //       console.log("Signature:", response.razorpay_signature);
    //       // Call the capturePayment function with the payment ID and order ID
    //       capturePayment(response.razorpay_payment_id, orderId);
    //     },
    //     prefill: {
    //       name: "John Doe",
    //       email: "john@example.com",
    //       contact: "9876543210",
    //     },
    //   };

    //   const razorpayCheckout = new window.Razorpay(options);
    //   razorpayCheckout.open();
    // } catch (error) {
    //   console.error("Error creating order:", error);
    // }

    // const startDate = new Date();
    // startDate.setDate(startDate.getDate() + 7);

    // var date = Math.round(startDate.getTime() / 1000);
    // console.log(date);

    // instance.subscriptions
    //   .create({
    //     plan_id: "plan_LmCI1CTXDlnROT",
    //     customer_notify: 1,
    //     quantity: 1,
    //     total_count: 12,
    //     start_at: date,
    //     notes: {
    //       key1: "value3",
    //       key2: "value2",
    //     },
    //   })
    //   .then((subscription) => {
    //     console.log("Subscription created:", subscription);
    //   })
    //   .catch((error) => {
    //     console.error("Error creating subscription:", error);
    //   });
  };

  const capturePayment = async (paymentId, orderId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/capture-payment",
        { paymentId, orderId }
      );
      console.log("Payment captured successfully");
    } catch (error) {
      console.error("Error capturing payment:", error);
    }
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
      <div class="alert">
        {notify && <Alert type="success" description={notify}></Alert>}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
          />
        )}
      </div>

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
                  setClassPlan(1);
                }}
              >
                <h1>1 to 1</h1>
                <p>Class</p>
                <div> Free Forever</div>
                {subscribed ? (
                  <div class="price-premium"> Subscribed </div>
                ) : (
                  <div class="price-free"> Free </div>
                )}
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
                  setClassPlan(2);
                }}
              >
                <h1>Upto 30</h1>
                <p>Participants</p>
                <div>₹999/Monthly</div>
                {subscribed ? (
                  <div class="price-premium"> Subscribed </div>
                ) : (
                  <div class="price-free"> Free Trial </div>
                )}
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
                  setClassPlan(3);
                }}
              >
                <h1>100+</h1>
                <p>Participants</p>
                <div>₹1499/Monthly</div>
                {subscribed ? (
                  <div class="price-premium"> Subscribed </div>
                ) : (
                  <div class="price-free"> Free Trial </div>
                )}
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
