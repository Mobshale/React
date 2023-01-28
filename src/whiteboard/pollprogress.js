import React, { useState } from "react";
import "./pprogress.css";
import { Card } from "antd";
import { Progress, Button, Modal, Table } from "antd";
import { MContext } from "./MyProvider";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import { get, getDatabase, ref, onValue } from "firebase/database";

const app = initializeApp(firebaseConfig);
const FirebaseDatabase = getDatabase(app);

var isShowingPro = false;
var interval = null;
var sec = null;
var theTimeout = null;
var prev = null;
var roomN;

const d = new Date();
const date = ("0" + d.getDate()).slice(-2);
const month = ("0" + (d.getMonth() + 1)).slice(-2);
const time = `${date}${month}${d.getFullYear()}`;

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

const dataSource = [
  {
    key: "1",
    name: "Mike",
    option: "A",
    seconds: "10ms",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
  {
    key: "2",
    name: "John",
    option: "B",
    seconds: "50s",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Option",
    dataIndex: "option",
    key: "option",
  },
  {
    title: "Seconds",
    dataIndex: "seconds",
    key: "seconds",
  },
];

class Pollprogress extends React.Component {
  constructor(props) {
    super(props);
    roomN = props.roomName;
    this.state = {
      setopen: false,
      showMyComponent: false,
      aPercent: 0,
      bPercent: 0,
      cPercent: 0,
      dPercent: 0,
      x: 0,
    };
  }

  componentDidMount() {
    const Ref = ref(FirebaseDatabase, time + "/poll/" + roomN + "/hits");
    onValue(Ref, (snap) => {
      const Data = snap.val();
      if (Data != null) {
        if (sec == null) {
          sec = Data.s;
          this.setState({
            aPercent: percentage(Data.a, Data.t),
            bPercent: percentage(Data.b, Data.t),
            cPercent: percentage(Data.c, Data.t),
            dPercent: percentage(Data.d, Data.t),
            x: sec,
          });
        } else {
          this.setState({
            aPercent: percentage(Data.a, Data.t),
            bPercent: percentage(Data.b, Data.t),
            cPercent: percentage(Data.c, Data.t),
            dPercent: percentage(Data.d, Data.t),
          });
        }
      }
    });
  }

  update = (msg) => {
    if (prev != msg) {
      prev = msg;
      if (msg === "pollprogress") {
        if (this.state.showMyComponent != true) {
          isShowingPro = true;
          this.setState({
            showMyComponent: true,
          });
        }
      } else if (msg === "pollprogressend") {
        console.log("Hey hcahkb");
        isShowingPro = false;
        sec = null;
        if (interval != null) {
          clearInterval(interval);
          interval = null;
        }
        this.setState({
          showMyComponent: false,
          setopen: false,
          aPercent: 0,
          bPercent: 0,
          cPercent: 0,
          dPercent: 0,
          x: 0,
        });
      }
    }
  };

  render() {
    if (isShowingPro) {
      if (interval == null) {
        console.log("came");

        interval = setInterval(() => {
          if (this.state.x != 0) {
            this.setState({ x: this.state.x - 1 });
          }
        }, 1000);
      }
    }

    return (
      <div>
        <MContext.Consumer>
          {(context) => this.update(context.state.message)}
        </MContext.Consumer>

        <div
          class="progress"
          style={this.state.showMyComponent ? {} : { display: "none" }}
        >
          <Card
            title="Poll progress"
            bordered={false}
            extra={<div class="secc">{this.state.x}</div>}
            style={{ width: 300 }}
          >
            <div class="sec">
              <p>A</p>{" "}
              <Progress percent={this.state.aPercent} status="active" />
            </div>
            <div class="sec">
              <p>B</p>{" "}
              <Progress percent={this.state.bPercent} status="active" />
            </div>
            <div class="sec">
              <p>C</p>{" "}
              <Progress percent={this.state.cPercent} status="active" />
            </div>
            <div class="sec">
              <p>D</p>{" "}
              <Progress percent={this.state.dPercent} status="active" />
            </div>
            <Button
              type="primary"
              disabled="true"
              onClick={() => this.setState({ setopen: true })}
              block
            >
              Leaderboard
            </Button>
          </Card>
          <Modal
            title="Leaderboard"
            centered
            visible={this.state.setopen}
            // onOk={() => this.setState({setopen: false})}
            onCancel={() => this.setState({ setopen: false })}
            width={1000}
            footer={null}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 50 }}
              scroll={{ y: 240 }}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default Pollprogress;
