import React from "react";
import { Button, Card, Result } from "antd";
import "./pollsoption.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import {
  increment,
  getDatabase,
  push,
  remove,
  ref,
  set,
  get,
  child,
  update,
  DataSnapshot,
  onValue,
} from "firebase/database";

const app = initializeApp(firebaseConfig);
const FirebaseDatabase = getDatabase(app);
var sec = null,
  type = 3,
  ans = null;
var isShowingPoll = false;
var interval = null;
var timeout = null;
var roomN;

const d = new Date();
const date = ("0" + d.getDate()).slice(-2);
const month = ("0" + (d.getMonth() + 1)).slice(-2);
const time = `${date}${month}${d.getFullYear()}`;

class Pollsoption extends React.Component {
  constructor(props) {
    super(props);
    roomN = props.roomName;
    this.state = {
      show: false,
      optionsThing: true,
      resultSucess: false,
      isDisabled: true,
      x: 0,
    };
  }

  componentDidMount() {
    const Ref = ref(FirebaseDatabase, "/" + time + "/poll/" + roomN + "/pes");
    onValue(Ref, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        console.log(data.seconds);
        sec = data.seconds;
        type = data.polltype;
        ans = data.ans;
        isShowingPoll = true;

        console.log(sec);

        if (type == 3) {
          this.setState({
            optionsThing: true,
            show: true,
            isDisabled: false,
            x: sec,
          });
        } else {
          this.setState({
            optionsThing: true,
            show: true,
            isDisabled: true,
            x: sec,
          });
        }
      }
    });
  }

  componentDidUpdate() {
    if (isShowingPoll) {
      timeout = setTimeout(() => {
        isShowingPoll = false;
        if (interval != null) {
          clearInterval(interval);
          interval = null;
        }
        this.setState({
          show: false,
          optionsThing: false,
          resultSucess: false,
        });
      }, sec * 1000);
    }
  }

  optionClicked = (option) => {
    isShowingPoll = false;
    if (interval != null) {
      clearInterval(interval);
      clearTimeout(timeout);
      interval = null;
      setTimeout(() => {
        isShowingPoll = false;
        this.setState({
          show: false,
          optionsThing: false,
          resultSucess: false,
          x: 0,
        });
      }, 2000);
    }

    switch (option) {
      case 1:
        set(ref(FirebaseDatabase, "/" + time + "/poll/" + roomN + "/hits"), {
          a: increment(1),
          b: increment(0),
          c: increment(0),
          d: increment(0),
          t: increment(1),
          s: increment(0),
        });
        break;
      case 2:
        set(ref(FirebaseDatabase, "/" + time + "/poll/" + roomN + "/hits"), {
          a: increment(0),
          b: increment(1),
          c: increment(0),
          d: increment(0),
          t: increment(1),
          s: increment(0),
        });
        break;
      case 3:
        set(ref(FirebaseDatabase, "/" + time + "/poll/" + roomN + "/hits"), {
          a: increment(0),
          b: increment(0),
          c: increment(1),
          d: increment(0),
          t: increment(1),
          s: increment(0),
        });
        break;
      case 4:
        set(ref(FirebaseDatabase, "/" + time + "/poll/" + roomN + "/hits"), {
          a: increment(0),
          b: increment(0),
          c: increment(0),
          d: increment(1),
          t: increment(1),
          s: increment(0),
        });
        break;
      default:
        break;
    }

    if (ans == option) {
      this.setState({
        resultSucess: true,
        optionsThing: false,
      });
    } else {
      this.setState({
        resultSucess: false,
        optionsThing: false,
      });
    }
  };

  render() {
    console.log(isShowingPoll + "  " + interval);
    if (isShowingPoll) {
      if (interval == null) {
        console.log("came");

        interval = setInterval(() => {
          console.log("Helloo");
          if (this.state.x != 0) this.setState({ x: this.state.x - 1 });
        }, 1000);
      }
    }

    return (
      <div>
        {this.state.show ? (
          <div class="prag">
            <Card
              class="optioncard"
              title="Poll Option"
              style={{ width: "100%" }}
              extra={<div class="secc">{this.state.x}</div>}
            >
              {this.state.optionsThing ? (
                <div>
                  <div class="se">
                    <Button
                      type="primary"
                      bordered="true"
                      style={{ width: "50%", height: "100%" }}
                      onClick={() => {
                        this.optionClicked(1);
                      }}
                    >
                      Option A
                    </Button>
                    <Button
                      type="primary"
                      bordered="true"
                      style={{ width: "50%", height: "auto" }}
                      onClick={() => {
                        this.optionClicked(2);
                      }}
                    >
                      Option B
                    </Button>
                  </div>

                  <br></br>
                  <div class="sem">
                    <Button
                      disabled={this.state.isDisabled}
                      type="primary"
                      style={{ width: "50%", height: "auto" }}
                      onClick={() => {
                        this.optionClicked(3);
                      }}
                    >
                      Option C
                    </Button>
                    <Button
                      disabled={this.state.isDisabled}
                      type="primary"
                      style={{ width: "50%", height: "auto" }}
                      onClick={() => {
                        this.optionClicked(4);
                      }}
                    >
                      Option D
                    </Button>
                  </div>
                </div>
              ) : (
                <div class="result">
                  {this.state.resultSucess ? (
                    <Result
                      status="success"
                      title="Correct answer"
                      subTitle="Well done, keep the speed!"
                    ></Result>
                  ) : (
                    <Result
                      status="error"
                      title="Wrong answer"
                      subTitle="Ha better luck next time!"
                    ></Result>
                  )}
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Pollsoption;
