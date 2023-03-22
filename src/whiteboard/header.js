import React, { Component } from "react";
import { Popover, Tooltip, Typography } from "antd";
import "antd/dist/antd.css";
import exit from "./image/exit.svg";
import { MContext } from "./MyProvider";
import "./header.css";
import {
  FundProjectionScreenOutlined,
  ShareAltOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
import { CopyOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, Space } from "antd";
import { Link, Redirect } from "react-router-dom";

const { confirm } = Modal;
const { Title } = Typography;
var roomName,
  type,
  SessionType = 0;
var app, db, sharelink;

const d = new Date();
const date = ("0" + d.getDate()).slice(-2);
const month = ("0" + (d.getMonth() + 1)).slice(-2);
const time = `${date}${month}${d.getFullYear()}`;

async function createDynamicLink(desktopUrl) {
  const endpoint =
    "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBLmj6rV2GfYEnu9JKD6XsWmRlG8gvaHqs";
  const payload = {
    dynamicLinkInfo: {
      domainUriPrefix: "https://mobshale.page.link",
      link: desktopUrl,
      androidInfo: {
        androidPackageName: "com.mobshale.app",
      },
    },
    suffix: {
      option: "UNGUESSABLE",
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log(response);
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(errorMessage);
    // throw new Error("Failed to create dynamic link");
  }

  const { shortLink, previewLink } = await response.json();

  console.log(shortLink);
  return shortLink;

  //   return {
  //     shortLink,
  //     previewLink,
  //   };
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    roomName = props.roomName;
    type = props.teacher;
    SessionType = props.SessionType;

    this.state = {
      redirect: false,
      linkmain: "",
    };
    if (SessionType == 1) {
      sharelink =
        "https://flames.mobshale.com/Redirect/" + roomName + "/one2one";
    } else {
      sharelink =
        "https://flames.mobshale.com/Redirect/" + roomName + "/common";
    }

    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  }

  async componentDidMount() {
    var longUrl;
    if (SessionType == 1) {
      longUrl =
        "?type=" + SessionType + "&ch=" + roomName + "&classtype=" + "onetoone";
    } else {
      longUrl =
        "?type=" +
        SessionType +
        "&ch=" +
        roomName +
        "&classtype=" +
        "onetomany";
    }
    this.setState({
      linkmain: await createDynamicLink(sharelink + longUrl),
    });
  }

  async startCapture() {
    if (type == 1) {
      const postRef = ref(db, time + "/" + roomName + "/ss");
      set(postRef, 1);
      var tab = document.getElementById("sharescreen");
      tab.style.visibility = "visible";
    }
  }

  clearppt = (context) => {
    context.setMessage("pptremove");
  };

  showConfirm() {
    confirm({
      title: "Do you want to end the session",
      icon: <ExclamationCircleFilled />,
      onOk: async () => {
        console.log("OK");
        await update(ref(db, time + "/islive/" + roomName), {
          islive: 2,
        });
        this.setState({
          redirect: true,
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/Session" />;
    }

    const content = (
      <div>
        <Input.Group compact>
          <Input
            style={{
              width: "200px",
              // 'calc(100% - 200px)'
            }}
            defaultValue={this.state.linkmain}
          />
          <Tooltip title="copy session url">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(this.state.linkmain);
              }}
              icon={<CopyOutlined />}
            />
          </Tooltip>
        </Input.Group>
      </div>
    );

    return (
      <MContext.Consumer>
        {(context) => (
          <div class="header-tab">
            <Title
              level={3}
              style={{
                fontFamily: "sans-serif",
                textAlign: "center",
                marginLeft: "10px",
                marginTop: "4px",
              }}
            >
              flames{" "}
            </Title>
            {/* 
            <div
              style={{
                position: "relative",
                height: "100vh",
                width: "70%",
                margin: "0 auto",
              }}
            >
              <Title
                level={2}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "15px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(20%,50%)",
                }}
              >
                {}
              </Title>
            </div> */}

            {type === 1 ? (
              <div class="sharescreen-btn">
                <div class="draw-headerbox-box-cell">
                  <div
                    id="tool-headerbox-cell-screen"
                    class="tool-headerbox-cell"
                    onClick={this.startCapture}
                  >
                    <Tooltip
                      placement="bottomRight"
                      title={<span>Share screen</span>}
                    >
                      <FundProjectionScreenOutlined
                        style={{ fontSize: "20px" }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ) : null}

            <div class="sharelink-btn">
              <div class="draw-headerbox-box-cell">
                <div id="tool-headerbox-cell" class="tool-headerbox-cell">
                  <Popover
                    placement="bottomRight"
                    title={"Share link"}
                    content={content}
                    trigger="hover"
                  >
                    <ShareAltOutlined style={{ fontSize: "20px" }} />
                  </Popover>
                </div>
              </div>
            </div>

            {type === 1 ? (
              <div class="deleteppt-btn">
                <div class="draw-headerbox-box-cell">
                  <div
                    id="tool-headerbox-cell"
                    class="tool-headerbox-cell"
                    onClick={() => this.clearppt(context)}
                  >
                    <Tooltip
                      placement="bottomRight"
                      title={<span>Clear ppt</span>}
                    >
                      <DeleteOutlined style={{ fontSize: "20px" }} />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ) : null}

            <div class="end-class-btn">
              <div class="draw-headerbox-box-cell">
                <div
                  id="tool-headerbox-cell-screen"
                  class="tool-headerbox-cell"
                  onClick={() => this.showConfirm()}
                >
                  <Tooltip
                    placement="bottomRight"
                    title={<span>End Class</span>}
                  >
                    <img class="exit" src={exit} alt="End class"></img>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        )}
      </MContext.Consumer>
    );
  }
}

export default Header;
