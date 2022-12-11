import React, { Component } from "react";
import { RealisticPen } from "./Realisticpen";
import "./canvaboard.css";
import { MContext } from "./MyProvider";

var tool = "pen",
  canvas,
  ctx,
  realisticPen,
  roomName,
  type;

function attach() {
  console.log(realisticPen);
  realisticPen.updateTool(tool);
}

function isInt(value) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

class Canvaboard extends React.Component {
  constructor(props) {
    super(props);

    tool = props.message;
    roomName = props.roomName;
    type = props.type;

    console.log(roomName);

    this.state = {
      color: props.color,
    };
  }

  componentDidMount() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    var w, h;
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.fillStyle = "#F3F6F9";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    realisticPen = new RealisticPen(
      canvas,
      {
        penColor: "#000",
        brushSize: 0.5,
      },
      tool,
      roomName,
      type
    );
  }

  update = (tol) => {
    if (typeof canvas != "undefined") {
      if (isInt(tol)) {
        realisticPen.pageChange(tol);
      } else {
        switch (tol) {
          case "clear":
            realisticPen.clear();
            break;
          case "new":
            realisticPen.setNewPage();
            break;
          case "pollprogress":
            break;
          default:
            tool = tol;
            attach();
            break;
        }
      }
    }
  };

  render() {
    return (
      <div>
        <MContext.Consumer>
          {(context) => this.update(context.state.message)}
        </MContext.Consumer>
        <canvas
          id="canvas"
          class="canvas"
          styles={{ border: "1px solid black" }}
        ></canvas>
      </div>
    );
  }
}

export default Canvaboard;
