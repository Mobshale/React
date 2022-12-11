import { deleteApp, initializeApp } from "firebase/app";
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
  update,
} from "firebase/database";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import laser from "../svg/arrow.svg";
import { useSyncExternalStore } from "react";

export function RealisticPen(inCanvas, inOptions, tol, roomName, type) {
  console.log(roomName);
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  var wirtng = 0;
  var prev = null;
  var pptlist = [];
  var imagesbase = [];
  var base64 = [];
  console.log(tol);
  var clearedforstudent = false;
  var llx, lly, hhx, hhy;
  var Previouswasmove = false;

  var image = new Image();
  image.src = laser;
  image.onload = () => {};

  document.addEventListener("keydown", (e) => textlistner(e));

  //writing
  var typing = 0;
  var recentWord = [];
  var UndoList = [];

  const pptRef = ref(db, "ppt/" + roomName);
  onValue(pptRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      pptlist.push(childSnapshot.val());
    });
    for (var i = 0; i < pptlist.length; i++) {
      lop(i);
    }
    drawimage();
  });

  var _context = null,
    _mouseX = null,
    _mouseY = null,
    position = null,
    dragingstrtLoc = null,
    _mouseXStart = null,
    _mouseYStart = null,
    snapshot = null,
    snapshot2 = null,
    textlistner,
    cursor = true,
    interval = null,
    _prevCoords = {
      x: null,
      y: null,
    },
    tool = tol,
    _currentDelta = null,
    _painters = null,
    _updateInterval = null,
    _canvas = null,
    _container = null,
    secPath = null,
    selectedItem = 0,
    strtDrag = false,
    tempPoints = [],
    temptool = "pen",
    clicked = false,
    _canvasDefWidth = 200,
    _canvasDefHeight = 200,
    _options = {
      penColor: [0, 0, 0],
      brushSize: 3,
    },
    pages = [],
    x,
    y,
    previousPage = 1,
    lineWidth = 1,
    prevlw = lineWidth,
    currentPage = 1,
    pathsry = [],
    points = [],
    _brushSizes = {
      1: 4.5,
      2: 4.25,
      3: 4,
      4: 3.75,
      5: 3.5,
      6: 3.25,
      7: 3,
      8: 2.75,
      9: 2.5,
      10: 2.25,
      11: 2.2,
      12: 2.15,
      13: 2.1,
      14: 2.05,
      15: 2,
      16: 1.95,
      17: 1.9,
      18: 1.85,
      19: 1.8,
      20: 1.75,
      21: 1.7,
      22: 1.65,
      23: 1.6,
      24: 1.55,
      25: 1.5,
      26: 1.48,
      27: 1.46,
      28: 1.44,
      29: 1.42,
      30: 1.4,
      31: 1.38,
      32: 1.36,
      33: 1.34,
      34: 1.32,
      35: 1.3,
      36: 1.28,
      37: 1.26,
      38: 1.24,
      39: 1.22,
      40: 1.2,
      41: 1.18,
      42: 1.16,
      43: 1.14,
      44: 1.12,
      45: 1.1,
      46: 1.08,
      47: 1.06,
      48: 1.04,
      49: 1.02,
      50: 1,
    };

  //top bottom
  var lowy = 0,
    lowx = 0,
    highx = 0,
    highy = 0;

  var maxLineWidht = 0; //Math.max.apply(null, _brushSizes);
  for (var key in _brushSizes) {
    maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
  }

  // checking if the user is teacher or student teacher =1 , student =0

  if (type == "1") {
    onValue(ref(db, "/pages" + "/" + roomName), (snapshot) => {
      // console.log("firbase updated")
      var pstry;
      pstry = snapshot.val();
      if (pstry != null) {
        pages = pstry;
        console.log(pages);
        if (pages[currentPage - 1] != null) {
          if (typeof pages[currentPage - 1] != "undefined") {
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
            Redraw(currentPage - 1);
          }
        }
      }
    });
  }

  if (type == "0") {
    onValue(ref(db, "/" + roomName + "live"), (snap) => {
      // console.log(snapshot);
      if (clearedforstudent) {
        snapshot = null;
        clearedforstudent = false;
      }
      var live = snap.val();
      var w = _canvas.clientWidth;
      var h = _canvas.clientHeight;
      if (snapshot != null) {
        resotreSnapShotCanvas();
      }
      takeSnapShotCanvas();
      _context.drawImage(image, (live.x * w) / live.w, (live.y * h) / live.h);
    });

    onValue(ref(db, "/pages" + "/" + roomName), (snapshot) => {
      console.log("firbase updated");
      var pstry;
      pstry = snapshot.val();
      if (pstry != null) {
        pages = pstry;
        console.log(pages);
        if (pages[currentPage - 1] != null) {
          if (typeof pages[currentPage - 1] != "undefined") {
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
            Redraw(currentPage - 1);
          }
        }
      }
    });

    const starCountRef = ref(db, "/" + roomName);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data.tool)
      var w = _canvas.clientWidth;
      var h = _canvas.clientHeight;
      if (data != null) {
        tool = data.tool;
        previousPage = data.p;

        if (currentPage != data.c) {
          currentPage = data.c;
          drawimage();
          pageChangeOn(currentPage);
        }
        switch (data.s) {
          case 0:
            wirtng = 0;
            if (prev != null) {
              _strokeEnd((data.x * w) / data.w, (data.y * h) / data.h);
              // getdrawings();
            }
            break;
          case 1:
            if (wirtng == 0) {
              _strokeStart((data.x * w) / data.w, (data.y * h) / data.h);
              wirtng = 1;
            } else {
              _stroke((data.x * w) / data.w, (data.y * h) / data.h);
            }
            break;
          case 2:
            snapshot = null;
            snapshot2 = null;
            clearedforstudent = true;
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
            drawimage();
            break;
        }
        prev = data;
      }
    });
  }

  window.onresize = function (event) {
    var w, h;
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    _context.canvas.width = w;
    _context.canvas.height = h;
    _context.fillStyle = "#F3F6F9";
    _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
    if (pathsry != null) {
      pages[currentPage - 1] = pathsry;
      Redraw(currentPage - 1);
    }
  };

  this.destroy = function () {
    clearInterval(_updateInterval);
  };
  this.updateTool = function (toolU) {
    tool = toolU;
    console.log(tool);
    switch (tool) {
      case "pen":
        _canvas.style.cursor =
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ2SURBVHgB7ZXPqxJRFMfvjI4F+cqkTcrjge9B+B+0LJQ27lq4ijZprly6DaF1COKPjYRrVy0CF/aof6Baa6ChOPkLFcdMm1+dM93RafzxZuptgnfgC3ecO+dzz497JOTKNsZMp9OAoihvZFku4xp/I5dsbL/fP221Wl/D4bCKwnWn0znDd+SSDE/N6ZBgMKjJBNuKzC4dHTgQ5PF4bququn7R7XZJPB4/kSTpHcBOiQlmJ6cMpCvAcdz5ZDJhF4tF1u12v4jFYkc8z683+f1+Uq1W38K+x/AogVQ7ETF4SnB+Ho1GTxKJxDFC2u32q1KpJPh8vvVGjHK5XM4xahv+tYgRcranJrNarfay2WwKoVBIRTUajW42m70P390EOYmFrOEGdhfECEMIwur1Og+p5VOp1CP47piCOB3EXBBJAIuLRcZi7zKsSaVSEbxe70N4FEEL0AyE6VuBZEJD2wmyAkHDmoxGIwGW36ljBP2gUEXf5/wXCDZBsVjky+XyUwpCyBL0k0ai7gNp3WUVUigUvgHoWSaTaRoi2YJojk1r52q1eh2JRJ5YgUB3Pc/n83WyXRPV/A1rWrtgSAZsQL6Q3ynTI1F2QdCMqXNQEGsDMqMgrMt6ChwCaXcGYdBFjA3InELkQxBCtkcEI4riHyPFCMnlcnEKMbYzQhRi0TCKa6A76XT6wWAweD8ejz8Oh8PPcEc+9Xq9D8lkMgLv74Hugo5ALmJzlumG4+IG6BZ1dJ06wtPqN14gmza2FYljD1SljrCTsAaYpjnZFP7CmpADEel/ai4qffLiqSUKFSlEP8xfgYwwlmzyr1KYHoUtgBU4Y9D/Y78AxCeE/aWoyrkAAAAASUVORK5CYII=) 2 22, auto";
        break;
      case "straight":
        _canvas.style.cursor = "crosshair";
        break;
      case "elipse":
        _canvas.style.cursor = "crosshair";
        break;
      case "rec":
        _canvas.style.cursor = "crosshair";
        break;
      case "triangle":
        _canvas.style.cursor = "crosshair";
        break;
      case "rohmbus":
        _canvas.style.cursor = "crosshair";
        break;
      case "arrow":
        _canvas.style.cursor = "crosshair";
        break;
      case "laser":
        _canvas.style.cursor =
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciB4PSItMTIwJSIgeT0iLTEyMCUiIHdpZHRoPSIzNDAlIiBoZWlnaHQ9IjM0MCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImEiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjQiIGluPSJTb3VyY2VHcmFwaGljIi8+PC9maWx0ZXI+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkgOSkiIGZpbGw9IiNGRjAxMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBmaWx0ZXI9InVybCgjYSkiIGN4PSI1IiBjeT0iNSIgcj0iNSIvPjxwYXRoIGQ9Ik01IDhhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2em0wLTEuNzE0YTEuMjg2IDEuMjg2IDAgMSAxIDAtMi41NzIgMS4yODYgMS4yODYgMCAwIDEgMCAyLjU3MnoiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48L3N2Zz4='),auto";
        break;
      case "drag":
        _canvas.style.cursor =
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTkuMTU0IDBBMS4yMjYgMS4yMjYgMCAwIDAgOC4xMS42MDdjLS4yMDguMzQ4LS4yOTUuNzY4LS4zNDUgMS4yMzItLjEuOTI5LS4wMjUgMi4wNTgtLjAxNCAzLjA0Ni4wMDcuNTEyLjAwNCAxLjA0MS0uMDAxIDEuNTQ3YTYzLjMxIDYzLjMxIDAgMCAxLS4zNS0uOXYtLjAwM2wtLjAwMS0uMDAxYy0uMzU5LS45MjYtLjY5Mi0xLjg3LTEuMTUtMi41NjItLjIzLS4zNDYtLjQ5Ni0uNjQtLjg1LS44MDctLjM1Ni0uMTY2LS43OTItLjE2NS0xLjIwNC4wMmwtLjAwMy4wMDEtLjAwNC4wMDJjLS40LjE4Ny0uNjUuNTYzLS43MjIuOTU4LS4wNzQuMzk0LS4wMTkuODEyLjA4MiAxLjI2Mi4yMDMuOS42MTMgMS45NC44OTIgMi45Ny4yMi44MTMuNDM0IDEuNjMyLjYxMyAyLjMyMmExMy44NTUgMTMuODU1IDAgMCAwLS44NzQtLjgxNmMtLjU0My0uNDYyLTEuMTQtLjg4OS0xLjc1Ny0xLjExOS0uNjE2LS4yMy0xLjMyMy0uMjQ0LTEuODQ1LjIxOGwtLjAwNC4wMDQtLjAwNC4wMDRjLS40MS4zODQtLjYxNC44Ni0uNTYgMS4zMjMuMDUzLjQ2NC4zMDcuODcxLjY0MiAxLjI5LjY2OS44MzYgMS43MiAxLjc1MSAyLjczNCAyLjk2OCAxLjEzNSAxLjM2MiAyLjM3MiAzLjUzOCAzLjI1MSA0LjY4MWwuMTE4LjE1M2g3LjcwNGwuMDg2LS4yNzRjLjE1LS40ODIuMzE4LTEuNDQyLjU4Ny0yLjY0Mi4yNjgtMS4yLjYyNy0yLjYxIDEuMTA0LTMuODQ3LjYzNS0xLjY0NiAxLjI4NS0zLjE5NCAxLjU3Ny00LjQyMy4xNDctLjYxNC4yMTQtMS4xNTEuMDk1LTEuNjI2YTEuMzA2IDEuMzA2IDAgMCAwLTEuMDQ4LS45NmMtLjQ2Ny0uMDg4LS45MS4xMi0xLjIyLjQzNC0uMzEuMzE2LS41NDYuNzM2LS43NjUgMS4yMDctLjE3LjM2NS0uMzI3Ljc2NS0uNDgxIDEuMTY2bC0uMDEtMS43MzRjLS4wMDQtMS4wMDcuMDU5LTIuMTM2LS4wMTctMy4wNDQtLjAzOC0uNDU1LS4xMDMtLjg1NS0uMjcyLTEuMTkxLS4xNjUtLjMyNy0uNTI0LS42LS45MjUtLjU4NWExLjE4IDEuMTggMCAwIDAtLjk2OS40NmMtLjIyMy4yODUtLjM1NC42MzYtLjQ1OSAxLjAyMy0uMjEuNzczLS4zMDIgMS43MDktLjQ0MyAyLjQ4bC0uMTk1IDEuMDkyYTQ1Ljg3NCA0NS44NzQgMCAwIDEtLjEzNi0xLjE4N2MtLjA5NC0uOTM3LS4xNi0yLjA1NS0uMzU2LTIuOTctLjA5Ny0uNDU3LS4yMjItLjg2Ni0uNDM1LTEuMTk5LS4yMTQtLjMzMi0uNTgyLS41OTctMS4wMS0uNTc5aC4wM0w5LjE1NSAweiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik05LjE1Ljc4NGguMDQ5Yy4xMzItLjAwNS4xOTUuMDMuMzE3LjIyLjEyMy4xOTIuMjQxLjUyOC4zMjkuOTM5LjE3NS44Mi4yNDUgMS45MjQuMzQyIDIuODg0LjIxMiAyLjEwOC41MTQgMy42MzUuNTE0IDMuNjM1bC43Ny0uMDEzcy4yODctMS43NjMuNTk4LTMuNDYzYy4xNS0uODIuMjQ3LTEuNzQ2LjQyOS0yLjQxNy4wOS0uMzM1LjIwNy0uNi4zMTktLjc0My4xMTItLjE0Mi4xNjktLjE3NC4zMTktLjE2M2wuMDMuMDAyLjAyOC0uMDAyYy4xMi0uMDA5LjExNi0uMDEuMi4xNTYuMDg0LjE2Ny4xNTcuNDk1LjE5MS45MDMuMDY4LjgxNS4wMSAxLjk0Mi4wMTUgMi45ODNsLjAxOSAzLjcwNS43NDUuMTY4Yy40NTUtLjk0OC44MTktMi4xMTIgMS4yMjEtMi45NzguMjAxLS40MzMuNDE1LS43ODcuNjEzLS45ODguMTk3LS4yLjMyMy0uMjUuNTE2LS4yMTNoLjAwNGwuMDA1LjAwMmMuMjk5LjA1MS4zNi4xMjcuNDI0LjM3OC4wNjMuMjUuMDM1LjY5Ny0uMDk3IDEuMjU0LS4yNjUgMS4xMTUtLjkwNyAyLjY2NC0xLjU0NiA0LjMyMi0uNTAyIDEuMy0uODY2IDIuNzQtMS4xMzggMy45NTctLjIyLjk4My0uMzg3IDEuODM0LS40OTkgMi4zMDRINy4xNDRjLS44MDItMS4wOS0xLjk5Ny0zLjE2LTMuMTU3LTQuNTUyLTEuMDYtMS4yNzEtMi4xMzYtMi4yMi0yLjcyNC0yLjk1Ni0uMjk0LS4zNjgtLjQ1LS42NzMtLjQ3Ni0uODktLjAyNS0uMjE1LjAyNi0uMzg2LjMxMi0uNjU2LjI3LS4yMzcuNTgyLS4yNDMgMS4wNDktLjA2OS40NjcuMTc1IDEuMDE4LjU1MiAxLjUyNC45ODJhMTUuODggMTUuODggMCAwIDEgMS44NDcgMS45MDRsLjY4Ny0uMzRzLS41MDQtMi4wMS0xLjAxLTMuODcyQzQuOTAzIDYuMDggNC40OTQgNS4wMyA0LjMxNCA0LjIzYy0uMDktLjQtLjExNi0uNzMzLS4wNzctLjk0Ny4wNC0uMjEzLjA5Ny0uMzAyLjI4My0uMzkuMjQ4LS4xMS4zODgtLjA5OC41NDctLjAyNC4xNTkuMDc0LjM0NC4yNTEuNTI5LjUzLjM2OC41NTcuNzEgMS40NzYgMS4wNzMgMi40MTJsLS4wMDItLjAwNGMuMzcuOTgzIDEuMDc4IDIuNzE0IDEuMDc4IDIuNzE0bC43NTUtLjEzN3MuMDU1LTEuOTEuMDM2LTMuNTA5Yy0uMDEyLTEuMDE4LS4wNzgtMi4xMzYuMDEtMi45NTIuMDQzLS40MDguMTMxLS43MzUuMjM4LS45MTUuMTA3LS4xNzkuMTctLjIyNS4zNjctLjIyNHoiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNNy43MjMgMTAuOHY0LjY5MmMwIC4xOTIuMjIzLjM0OC41LjM0OC4yNzYgMCAuNS0uMTU2LjUtLjM0OFYxMC44YzAtLjE5Mi0uMjI0LS4zNDgtLjUtLjM0OC0uMjc3IDAtLjUuMTU2LS41LjM0OHptMi4yMDYgMHY0LjY5MmMwIC4xOTIuMjI0LjM0OC41LjM0OHMuNS0uMTU2LjUtLjM0OFYxMC44YzAtLjE5Mi0uMjI0LS4zNDgtLjUtLjM0OHMtLjUuMTU2LS41LjM0OHptMi4yMDYgMHY0LjY5MmMwIC4xOTIuMjI0LjM0OC41LjM0OC4yNzcgMCAuNS0uMTU2LjUtLjM0OFYxMC44YzAtLjE5Mi0uMjIzLS4zNDgtLjUtLjM0OC0uMjc2IDAtLjUuMTU2LS41LjM0OHoiIGZpbGw9IiMwMDAiLz48L2c+PC9zdmc+'),auto";
        break;
      case "eraser":
        _canvas.style.cursor =
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANKSURBVHgB1VTdS5NhFD/7iuXa8KNw7SK/IjBYo13soqvEITENtj9AwZiCOCTvQrNWF9rFFPGLrC1iF10Oiy68mBSUF2KB4YabhKKyTfFCc+3Lzb2ds72LsfbxCkZ04Mf7Puc5z/k95+M5AP+R8OAvCW9nZ6cyHo8/SSaTc4RQKKQ+S0JyxFtbW6va39//ZjKZmMbGRkar1TJOp5MhYtwXwBkQkgMROnyXIcmGw+FgYrHY00JkQm4cqYPCaDQ6ZrFY7i4sLPxhMDg4SJ8hTOOWRCJ5jf8npyUiEgE6eGy1Wk12u72gIZHJZDLr4eHhVnl5+YdsslL5pH1+JBIx22y2h9PT01BKpFIpLC4ufhKJRFpcxhEM6fmlSMLh8P35+XlOJCTBYBC2t7dr8fdctv+iRHjI4HK5LAMDA8BVFAoFyOVyH/6KIKsxCtVIgC188+Dg4CV2GJxGpqamYHR09AHklEWQY5d6K/gg67HD3huNRrlKpYLNzU3gIsPDw8Dn84fa29s/4zIK6Rol8xIhSUMikXB2dXXV4AHo6en5KhaLFcvLy0VJent7QaPRzKrV6le4DCEi2UTCnGgE1dXVj3Q6XY1er08drKiosK2urnbjnrFQQxBJU1PTC3y4kyxJGHEMWe2dTUSNIcLZVXl0dAStra3BiYmJOTqgVCqfu91uull3LhlFjbZv6urqiCTIElHaEsC2dq4QqXRlZeUePsrUDFtfX/eZzebbqL+GuIFks1js32OHRtHu7u5H3FMiahFViPNQYuZRO8oQVzY2NibJocFgYAKBgLuzs/M66hsQKuzELx0dHak9rKe3paXlFurrERdZEiGUGARkcAFxmSJAJ/aRkRGGnOKwdPn9/rG9vT0HXaC5uZnxer3+vr4+HdpeRVxClBWLJFuZqhF7gAjL0PGz8fFxvcfjSY0WevVUv5mZmQDWyog1/I52PyBdlxgUqUu+qMSQznVtW1ubBlP3dmlpicnA5/N5+vv770C6bhS9lEu6eHnWFP45NioJS5xxRLdNsrenKH5CusNOWH1BEeTRMTnI6MgZpYYeYhhOmS5eEX0mMhELPktGoBd/zCWSUkTAOs4QZqZ8JsokS8Kp8KWICtlwdv5P5BchBHaEIRURoQAAAABJRU5ErkJggg==) 8 18, auto";
        break;
      case "selector":
        _canvas.style.cursor = "crosshair";
        break;
      case "text":
        _canvas.style.cursor = "text";
        break;
    }
  };

  this.clear = function (toolU) {
    snapshot = null;
    snapshot2 = null;
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
    _context.fillStyle = "#F3F6F9";
    _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
    writeUserData(roomName, tool, 0, 0, 2);
    //deleting the page on server
    const postListRef = ref(
      db,
      "/pages" + "/" + roomName + "/" + (previousPage - 1)
    );
    // const newPostRef = push(postListRef);
    remove(postListRef);
    // set(newPostRef, pages[previousPage-1]);
    drawimage();
    pathsry = [];
  };

  this.setPenColor = function (inColor) {
    _options.penColor = _ensureRgb(inColor);
  };

  this.setBrushSize = function (inBrushSize) {
    _options.brushSize = inBrushSize;
  };

  this.setNewPage = function () {};

  // when a teacher chages the page on whiteboard
  this.pageChange = function (val) {
    snapshot = null;
    snapshot2 = null;
    currentPage = val;
    console.log(val);
    writeUserData(roomName, tool, 0, 0, 3);

    console.log(pages);
    if (previousPage < val) {
      if (pages.length < val) {
        console.log("new page");
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        pages[previousPage - 1] = pathsry;
        const postListRef = ref(
          db,
          "/pages" + "/" + roomName + "/" + (previousPage - 1)
        );
        // const newPostRef = push(postListRef);
        set(postListRef, pages[previousPage - 1]);
        // set(newPostRef, pages[previousPage-1]);
        pathsry = [];
        drawimage();
      } else {
        console.log("after page");
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        pages[previousPage - 1] = pathsry;
        const postListRef = ref(
          db,
          "/pages" + "/" + roomName + "/" + (previousPage - 1)
        );
        // const newPostRef = push(postListRef);
        set(postListRef, pages[previousPage - 1]);
        // set(newPostRef, pages[previousPage-1]);
        pathsry = [];
        Redraw(previousPage);
      }
      previousPage = val;
    } else {
      _context.clearRect(0, 0, _canvas.width, _canvas.height);
      console.log("before page");
      _context.fillStyle = "#F3F6F9";
      _context.fillRect(0, 0, _canvas.width, _canvas.height);
      pages[previousPage - 1] = pathsry;
      const postListRef = ref(
        db,
        "/pages" + "/" + roomName + "/" + (previousPage - 1)
      );
      // const newPostRef = push(postListRef);
      set(postListRef, pages[previousPage - 1]);
      // set(newPostRef, pages[previousPage-1]);
      pathsry = [];
      Redraw(previousPage - 2);
      previousPage = val;
    }
  };

  function makeStrokeStyle(inOpacity) {
    var opacity = inOpacity ? inOpacity : 1;
    return (
      "rgba(" +
      _options.penColor[0] +
      ", " +
      _options.penColor[1] +
      ", " +
      _options.penColor[2] +
      ",  " +
      opacity +
      ")"
    );
  }

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  // redrawing the previous page
  function Redraw(val) {
    snapshot = null;
    snapshot2 = null;
    console.log("page ", val);
    if (pages != null) {
      console.log(pages);
      pathsry = pages[val];
      console.log(pathsry);
    }

    if (typeof pathsry == "undefined") {
      console.log("new page");
      _context.clearRect(0, 0, _canvas.width, _canvas.height);
      _context.fillStyle = "#F3F6F9";
      _context.fillRect(0, 0, _canvas.width, _canvas.height);
      pathsry = [];
      drawimage();
      return;
    }
    var maxLineWidht = 0; //Math.max.apply(null, _brushSizes);
    for (var key in _brushSizes) {
      maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
    }
    drawimage();
    pathsry.forEach((path) => {
      var k = path[0].z;
      switch (k) {
        case "pen":
          var dx = path[0].x;
          var dy = path[0].y;
          var ax = 0;
          var ay = 0;
          var div = 0.1;
          var ease = 0.7;
          var prvx = 0;
          var prvy = 0;
          for (let i = 0; i < path.length; i++) {
            _context.beginPath();
            var lineWidth = path[i].lw;

            var x = prvx;
            var y = prvy;

            prvx = path[i].x;
            prvy = path[i].y;

            var delta = Math.abs(x - prvx);
            if (
              _currentDelta !== null &&
              2 <= Math.abs(_currentDelta - delta)
            ) {
              _currentDelta =
                _currentDelta < delta ? _currentDelta + 1 : _currentDelta - 1;
            } else {
              _currentDelta = delta;
            }

            var xPrev = dx,
              yPrev = dy;

            ax = (ax + (dx - path[i].x) * div) * ease;
            dx -= ax;
            ay = (ay + (dy - path[i].y) * div) * ease;
            dy -= ay;

            // draw background line with opacity to smooth primaary line's edges
            // _context.strokeStyle =  makeStrokeStyle(0.001);
            // _context.lineWidth = lineWidth + 2;
            // _context.lineCap    = 'butt';
            // _context.lineJoin   = 'miter';

            // _context.moveTo(xPrev, yPrev);
            // _context.lineTo(dx,dy);
            // _context.stroke();

            //draw primary line without opacity
            _context.strokeStyle = makeStrokeStyle(1);
            _context.lineWidth = lineWidth;
            _context.lineCap = "round";
            _context.lineJoin = "miter";

            var w = _canvas.clientWidth;
            var h = _canvas.clientHeight;
            _context.moveTo((xPrev * w) / path[i].w, (yPrev * h) / path[i].h);
            _context.lineTo((dx * w) / path[i].w, (dy * h) / path[i].h);
            _context.stroke();
          }
          // _context.beginPath();
          // _context.moveTo(path[0].x,path[0].y);
          // for(let i = 1; i < path.length; i++){
          //     _context.lineTo(path[i].x,path[i].y);
          // }
          // _context.stroke();
          // console.log(path)
          // _strokeStart(path[0].x,path[0].y)
          // for(var v=1;v<path.length-2;v++){
          //     _stroke(path[v].x,path[v].y)
          // }
          // _strokeEnd(path[path.length-1].x,path[path.length-1].y);
          break;
        case "straight":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawLine(mousePos, dragingstrtLoc);
          break;
        case "elipse":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawCircle(mousePos, dragingstrtLoc);
          break;
        case "rec":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawRec(mousePos, dragingstrtLoc);
          break;
        case "triangle":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawTriangle(mousePos, dragingstrtLoc);
          break;
        case "rohmbus":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawRohmbus(mousePos, dragingstrtLoc);
          break;
        case "arrow":
          _context.lineWidth = path[0].lw;
          var mousePos = {
            x: path[1].x,
            y: path[1].y,
            w: path[1].w,
            h: path[1].h,
          };
          var dragingstrtLoc = {
            x: path[0].x,
            y: path[0].y,
            w: path[0].w,
            h: path[0].h,
          };
          drawArrow(mousePos, dragingstrtLoc);
          break;
        case "text":
          var w = _canvas.clientWidth;
          var h = _canvas.clientHeight;

          var pa = path[0].text;
          console.log(pa);
          var text = "";
          for (var k = 0; k < pa.length; k++) {
            console.log(pa[k]);
            text = text + "" + pa[k];
          }
          console.log(text);

          _context.font = "30px Arial";
          _context.fillStyle = "black";
          //  _context.fillText(text,path[0].x,path[0].y);
          _context.fillText(
            text,
            (path[0].x * w) / path[0].w,
            (path[0].y * h) / path[0].h
          );
          break;
      }
    });
  }

  function lop(i) {
    console.log(i);
    imagesbase[i] = new Image();
    imagesbase[i].src = pptlist[i];
    imagesbase[i].setAttribute("crossOrigin", "");
    imagesbase[i].onload = function () {
      //  ctx.drawImage(imagesbase[i], 40,0,w,h);
    };
  }

  function drawimage() {
    console.log(currentPage - 1);
    if (pptlist[currentPage - 1]) {
      var w = _canvas.clientWidth - 80;
      var h = _canvas.clientHeight;

      base64[currentPage - 1] = _canvas.todataUrl;

      imagesbase[currentPage - 1].onload = function () {
        console.log("jfks");
        _context.drawImage(
          imagesbase[currentPage - 1],
          40,
          10,
          w / 1.35,
          h / 1.1
        );
      };
      // imagesbase[pagecount].crossOrigin = "anonymous";
      _context.drawImage(
        imagesbase[currentPage - 1],
        40,
        10,
        w / 1.35,
        h / 1.1
      );

      // if(imagesbase[pagecount+1]){
      //     ctx.drawImage(imagesbase[pagecount+1], w+10,0,50,50);
      // }
      console.log(currentPage - 1);
    }
  }

  function _init(inCanvas, inOptions) {
    // _container = inCanvas.parentNode;

    if (inOptions) {
      _options = _extend(_options, inOptions);
    }

    _options.penColor = _ensureRgb(_options.penColor);

    _canvas = inCanvas;
    _context = _canvas.getContext("2d");
    saveState();

    if (type == "1") {
      _canvas.addEventListener(
        "mousemove",
        function (event) {
          var canvasOffset = _offset(_canvas);
          var w = _canvas.clientWidth;
          var h = _canvas.clientHeight;

          set(ref(db, "/" + roomName + "live"), {
            x: event.pageX - canvasOffset.left,
            y: event.pageY - canvasOffset.top,
            w: w,
            h: h,
          });
        },
        false
      );
    }

    _attachEventListeners();

    _context.globalCompositeOperation = "source-over";
    _mouseX = _canvas.width / 2;
    _mouseY = _canvas.height / 2;
    _painters = [];

    for (var i = 0; i < 1; i++) {
      _painters.push({
        dx: _canvas.width / 2,
        dy: _canvas.height / 2,
        ax: 0,
        ay: 0,
        div: 0.08,
        ease: 0.7,
      });
    }

    // _updateInterval = setInterval(update, 1000/90);
    _updateInterval = setInterval(update, 1000 / 90);

    function makeStrokeStyle(inOpacity) {
      var opacity = inOpacity ? inOpacity : 1;
      return (
        "rgba(" +
        _options.penColor[0] +
        ", " +
        _options.penColor[1] +
        ", " +
        _options.penColor[2] +
        ",  " +
        opacity +
        ")"
      );
    }

    var maxLineWidht = 0; //Math.max.apply(null, _brushSizes);
    for (var key in _brushSizes) {
      maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
    }

    function update() {
      lineWidth =
        _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;

      for (var i = 0; i < _painters.length; i++) {
        _context.beginPath();

        var xPrev = _painters[i].dx,
          yPrev = _painters[i].dy;

        _painters[i].ax =
          (_painters[i].ax + (_painters[i].dx - _mouseX) * _painters[i].div) *
          _painters[i].ease;
        _painters[i].dx -= _painters[i].ax;
        _painters[i].ay =
          (_painters[i].ay + (_painters[i].dy - _mouseY) * _painters[i].div) *
          _painters[i].ease;
        _painters[i].dy -= _painters[i].ay;

        // draw background line with opacity to smooth primaary line's edges
        // _context.strokeStyle =  makeStrokeStyle(0.001);
        // _context.lineWidth = lineWidth + 2;
        // _context.lineCap    = 'butt';
        // _context.lineJoin   = 'miter';

        // _context.moveTo(xPrev, yPrev);
        // _context.lineTo(_painters[i].dx, _painters[i].dy);
        // _context.stroke();

        //draw primary line without opacity
        _context.strokeStyle = makeStrokeStyle(1);
        _context.lineWidth = lineWidth;
        _context.lineCap = "round";
        _context.lineJoin = "miter";

        _context.moveTo(xPrev, yPrev);
        _context.lineTo(_painters[i].dx, _painters[i].dy);
        _context.stroke();
      }
    }
  }

  function takeSnapShotCanvas() {
    snapshot = _context.getImageData(0, 0, _canvas.width, _canvas.height);
  }
  function resotreSnapShotCanvas() {
    _context.putImageData(snapshot, 0, 0);
  }

  function takeSnapShotCanvas2() {
    snapshot2 = _context.getImageData(0, 0, _canvas.width, _canvas.height);
  }
  function resotreSnapShotCanvas2() {
    _context.putImageData(snapshot2, 0, 0);
  }

  function _strokeStart(mouseX, mouseY) {
    if (snapshot != null) {
      if (Previouswasmove) {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        Redraw(currentPage - 1);
        takeSnapShotCanvas();
        Previouswasmove = false;
      }
    }
    clearInterval(interval);
    document.removeEventListener("keydown", textlistner);
    if (recentWord.length > 0) {
      if (tool == "text") {
        points.push({
          x: dragingstrtLoc.x,
          y: dragingstrtLoc.y,
          z: tool,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
          lw: lineWidth,
          lx: lowx,
          ly: lowy,
          hx: highx,
          hy: highy,
          text: recentWord,
        });
        pathsry.push(points);
        points = [];
      } else {
        console.log(recentWord);
        points.push({
          x: dragingstrtLoc.x,
          y: dragingstrtLoc.y,
          z: "text",
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
          lw: lineWidth,
          lx: lowx,
          ly: lowy,
          hx: highx,
          hy: highy,
          text: recentWord,
        });
        pathsry.push(points);
        points = [];
        recentWord = [];
        snapshot = null;
        snapshot2 = null;
      }
    }

    lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
    if (!lineWidth) {
      lineWidth = prevlw;
    } else {
      prevlw = lineWidth;
    }
    dragingstrtLoc = {
      x: mouseX,
      y: mouseY,
      w: _canvas.clientWidth,
      h: _canvas.clientHeight,
    };
    if (type == "1") {
      writeUserData(roomName, tool, mouseX, mouseY, 1);
    }
    switch (tool) {
      case "pen":
        if (type == "0") {
          takeSnapShotCanvas();
        }
        _mouseXStart = _mouseX = mouseX;
        _mouseYStart = _mouseY = mouseY;
        if (type == "1") {
          points.push({
            x: mouseX,
            y: mouseY,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
          });
        }

        for (var i = 0; i < _painters.length; i++) {
          _painters[i].dx = mouseX;
          _painters[i].dy = mouseY;
        }
        break;
      case "straight":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "elipse":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "rec":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "triangle":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "rohmbus":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "arrow":
        // _canvas.style.cursor = "crosshair";
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        takeSnapShotCanvas();
        break;
      case "eraser":
        break;
      case "text":
        if (recentWord.length == 0) {
          if (snapshot2 !== null) {
            resotreSnapShotCanvas2();
          }
        }
        UndoList = [];
        recentWord = [];
        snapshot = null;
        snapshot2 = null;
        dragingstrtLoc = {
          x: mouseX,
          y: mouseY,
          w: _canvas.clientWidth,
          h: _canvas.clientHeight,
        };
        x = mouseX;
        y = mouseY;
        saveState();
        blinkingcursor(x, y);
        break;
      case "drag":
        Previouswasmove = true;
        points = [];
        pathsry.every((path) => {
          console.log(path);
          var lastpoint = path.length - 1;
          var lx, ly, hx, hy;
          console.log(lastpoint);
          lx = path[lastpoint].lx;
          ly = path[lastpoint].ly;
          hx = path[lastpoint].hx;
          hy = path[lastpoint].hy;
          console.log(mouseX, mouseY);
          console.log(lx, ly, hx, hy);
          if (lx < mouseX) {
            if (hx > mouseX) {
              if (ly < mouseY) {
                if (hy > mouseY) {
                  console.log("got in control of the element");
                  selectedItem = pathsry.indexOf(path);
                  console.log(pathsry);
                  console.log(selectedItem);
                  secPath = path;
                  pathsry = arrayRemove(pathsry, path);
                  Selecttheelement(lx, ly, hx, hy, path[lastpoint].z);
                  console.log("manojdd");
                  console.log(pathsry);
                  pages[currentPage - 1] = pathsry;
                  strtDrag = true;
                  clicked = true;
                  temptool = path[lastpoint].z;
                  //   _context.clearRect(0, 0, _canvas.width, _canvas.height);
                  //   _context.fillStyle = "#F3F6F9";
                  //   _context.fillRect(0, 0, _canvas.width, _canvas.height);
                  Redraw(currentPage - 1);
                  takeSnapShotCanvas();
                  return false;
                }
              }
            }
          }
          return true;
        });
        break;
    }
  }

  function Selecttheelement(lx, ly, hx, hy, tool) {
    llx = lx;
    lly = ly;
    hhx = hx;
    hhy = hy;
    pages[currentPage - 1] = pathsry;
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
    _context.fillStyle = "#F3F6F9";
    _context.fillRect(0, 0, _canvas.width, _canvas.height);
    Redraw(currentPage - 1);
    takeSnapShotCanvas();
  }

  function _stroke(mouseX, mouseY) {
    if (lowy === 0 || highy === 0) {
      lowy = mouseY;
      highy = mouseY;
    } else {
      if (lowy > mouseY) {
        lowy = mouseY;
      }
      if (highy < mouseY) {
        highy = mouseY;
      }
    }
    if (lowx === 0 || highx === 0) {
      lowx = mouseX;
      highx = mouseX;
    } else {
      if (lowx > mouseX) {
        lowx = mouseX;
      }
      if (highx < mouseX) {
        highx = mouseX;
      }
    }

    lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
    if (!lineWidth) {
      lineWidth = prevlw;
    } else {
      prevlw = lineWidth;
    }
    if (type == "1") {
      writeUserData(roomName, tool, mouseX, mouseY, 1);
    }
    switch (tool) {
      case "pen":
        _prevCoords.x = _mouseX;
        _prevCoords.y = _mouseY;

        _mouseX = mouseX;
        _mouseY = mouseY;

        var delta = Math.abs(_prevCoords.x - _mouseX);
        if (_currentDelta !== null && 2 <= Math.abs(_currentDelta - delta)) {
          _currentDelta =
            _currentDelta < delta ? _currentDelta + 1 : _currentDelta - 1;
        } else {
          _currentDelta = delta;
        }
        if (type == "1") {
          points.push({
            x: mouseX,
            y: mouseY,
            z: tool,
            w: _canvas.width,
            h: _canvas.height,
            lw: lineWidth,
            lx: 0,
            ly: 0,
            hx: 0,
            hy: 0,
          });
        }

        break;
      case "straight":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawLine(position, dragingstrtLoc);
        break;
      case "elipse":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawCircle(position, dragingstrtLoc);
        break;
      case "rec":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawRec(position, dragingstrtLoc);
        break;
      case "triangle":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawTriangle(position, dragingstrtLoc);
        break;
      case "rohmbus":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawRohmbus(position, dragingstrtLoc);
        break;
      case "eraser":
        erase(mouseX, mouseY);
        break;
      case "arrow":
        resotreSnapShotCanvas();
        position = {
          x: mouseX,
          y: mouseY,
          z: tool,
          w: _canvas.width,
          h: _canvas.height,
          lw: lineWidth,
          lx: 0,
          ly: 0,
          hx: 0,
          hy: 0,
        };
        drawArrow(position, dragingstrtLoc);
        break;
      case "drag":
        tempPoints = [];
        if (strtDrag) {
          console.log(temptool);

          if (temptool === "pen") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            _context.beginPath();
            tempPoints.push({
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: 0,
              ly: 0,
              hx: 0,
              hy: 0,
            });
            _context.moveTo(path[0].x - 12 - factx, path[0].y - 12 - facty);
            for (var k = 1; k < path.length; k++) {
              _context.lineTo(path[k].x - 12 - factx, path[k].y - 12 - facty);
              tempPoints.push({
                x: path[k].x - 12 - factx,
                y: path[k].y - 12 - facty,
                z: temptool,
                w: _canvas.width,
                h: _canvas.height,
                lw: lineWidth,
                lx: path[k].lx - 12 - factx,
                ly: path[k].ly - 12 - facty,
                hx: path[k].hx - 12 - factx,
                hy: path[k].hy - 12 - facty,
              });
            }
            _context.stroke();
            _context.strokeStyle = _context.strokeStyle;
            drawAround(factx, facty);
          } else if (temptool === "text") {
            // clicked = false;
            // tempPoints = [];
            // resotreSnapShotCanvas();
            // var factx = dragingstrtLoc.x - (mouseX-12);
            // var facty = dragingstrtLoc.y - (mouseY-12);
            // var path = secPath;
            // ctx.font = "14px  Comic Sans MS";
            // ctx.fillStyle = colour;
            // ctx.fillText(path[0].k, (path[0].x-12)-factx, (path[0].y-12)-facty);
            // tempPoints.push({x:(path[0].x-12)-factx,y:(path[0].y-12)-facty,z:temptool,a:colour,b:linew,w:w,h:h,k:path[0].k,lx:(path[0].lx-12)-factx,ly:(path[0].ly-12)-facty,hx:(path[0].hx-12)-factx,hy:(path[0].hy-12)-facty});
          } else if (temptool === "straight") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawLine(fnf, strt);
            drawAround(factx, facty);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          } else if (temptool === "elipse") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawCircle(fnf, strt);
            drawAround(factx, facty);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          } else if (temptool === "rec") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawRec(fnf, strt);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          } else if (temptool === "triangle") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawTriangle(fnf, strt);
            drawAround(factx, facty);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          } else if (temptool === "rohmbus") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawRohmbus(fnf, strt);
            drawAround(factx, facty);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          } else if (temptool === "arrow") {
            clicked = false;
            tempPoints = [];
            if (snapshot != null) {
              resotreSnapShotCanvas();
            }
            var factx = dragingstrtLoc.x - (mouseX - 12);
            var facty = dragingstrtLoc.y - (mouseY - 12);
            var path = secPath;
            var strt = {
              x: path[0].x - 12 - factx,
              y: path[0].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[0].lx - 12 - factx,
              ly: path[0].ly - 12 - facty,
              hx: path[0].hx - 12 - factx,
              hy: path[0].hy - 12 - facty,
            };
            var fnf = {
              x: path[1].x - 12 - factx,
              y: path[1].y - 12 - facty,
              z: temptool,
              w: _canvas.width,
              h: _canvas.height,
              lw: lineWidth,
              lx: path[1].lx - 12 - factx,
              ly: path[1].ly - 12 - facty,
              hx: path[1].hx - 12 - factx,
              hy: path[1].hy - 12 - facty,
            };
            drawArrow(fnf, strt);
            drawAround(factx, facty);
            tempPoints.push(strt);
            tempPoints.push(fnf);
          }
        } else {
          return;
        }
        break;
    }
  }
  function erase(mouseX, mouseY) {
    points = [];
    console.log(pathsry);
    pathsry.forEach((path) => {
      if (path.length != 0) {
        console.log(path);
        var lastpoint = path.length - 1;

        var lx, ly, hx, hy;
        console.log(lastpoint);

        lx = path[lastpoint].lx;
        ly = path[lastpoint].ly;
        hx = path[lastpoint].hx;
        hy = path[lastpoint].hy;

        console.log(lx, ly, hx, hy);

        if (lx < mouseX) {
          if (hx > mouseX) {
            if (ly < mouseY) {
              if (hy > mouseY) {
                console.log(path);
                var index = pathsry.indexOf(path);
                console.log(index, " manojd");
                // socket.emit('erase',index,Roomname,pagecount);
                pathsry = arrayRemove(pathsry, path);
                console.log(pathsry);
                pages[currentPage - 1] = pathsry;
                console.log(pages);
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
                _context.fillStyle = "#F3F6F9";
                _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
                Redraw(currentPage - 1);
                if (type == "1") {
                  const postListRef = ref(
                    db,
                    "/pages" + "/" + roomName + "/" + (previousPage - 1)
                  );
                  set(postListRef, pathsry);
                }
              }
            }
          }
        }
      }
    });
  }

  function textlistner(e) {
    console.log(e.key);
    if (tool == "text") {
      if (e.keyCode === 8) {
        if (recentWord.length > 0) {
          if (interval != null) {
            clearInterval(interval);
            if (!cursor) {
              resotreSnapShotCanvas2();
              snapshot2 = null;
              cursor = true;
              snapshot = null;
              undo();
              //   points.pop();
              var recentWords = recentWord[recentWord.length - 1];
              x -= _context.measureText(recentWords).width;

              //   Rwidth -= ctx.measureText(recentWords).width;
              recentWord.pop();
              if (recentWord.length != 0) {
                blinkingcursor(x, y);
              }
            } else {
              snapshot2 = null;
              cursor = true;
              snapshot = null;
              undo();
              //   points.pop();
              var recentWords = recentWord[recentWord.length - 1];
              x -= _context.measureText(recentWords).width;

              //   Rwidth -= ctx.measureText(recentWords).width;
              recentWord.pop();
              if (recentWord.length != 0) {
                blinkingcursor(x, y);
              }
            }
          } else {
            snapshot = null;
            undo();
            var recentWords = recentWord[recentWord.length - 1];
            x -= _context.measureText(recentWords).width;
            // Rwidth -= ctx.measureText(recentWords).width;
            recentWord.pop();
          }
        }
      } else if (
        e.keyCode == 13 ||
        e.keyCode == 37 ||
        e.keyCode == 38 ||
        e.keyCode == 39 ||
        e.keyCode == 40 ||
        e.keyCode == 16
      ) {
      } else {
        _context.font = "30px Arial";
        _context.fillStyle = "black";
        if (snapshot2 == null) {
          // resotreSnapShotCanvas2();
          _context.fillText(e.key, x, y);
          saveState();
          recentWord.push(e.key);
          clearInterval(interval);
          x += _context.measureText(e.key).width;
          blinkingcursor(x, y);
        } else {
          resotreSnapShotCanvas2();
          _context.fillText(e.key, x, y);
          saveState();
          recentWord.push(e.key);
          clearInterval(interval);
          x += _context.measureText(e.key).width;
          takeSnapShotCanvas2();
          blinkingcursor(x, y);
        }
      }
    }
  }
  function saveState() {
    UndoList.push(_canvas.toDataURL());
  }

  function undo() {
    UndoList.pop();

    var imgData = UndoList[UndoList.length - 1];
    var image = new Image();
    image.src = imgData;
    image.onload = function () {
      _context.clearRect(0, 0, _canvas.width, _canvas.height);
      _context.drawImage(
        image,
        0,
        0,
        _canvas.width,
        _canvas.height,
        0,
        0,
        _canvas.width,
        _canvas.height
      );
    };
  }

  function blinkingcursor(MouseX, MouseY) {
    _context.font = "30px Arial";
    _context.fillStyle = "black";
    // _context.fillText("Hello World",MouseX,MouseY);
    if (snapshot2 != null) {
      resotreSnapShotCanvas2();
      _context.fillText("|", MouseX, MouseY);
      cursor = false;
    }

    interval = setInterval(() => {
      if (cursor) {
        takeSnapShotCanvas2();
        _context.fillText("|", MouseX, MouseY);
        cursor = false;
      } else {
        if (snapshot2 != null) {
          resotreSnapShotCanvas2();
        }
        cursor = true;
      }
    }, 500);
  }

  function drawRec(mousePos, drag) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    _context.beginPath();
    _context.rect(
      (drag.x * w) / drag.w,
      (drag.y * h) / drag.h,
      (mousePos.x * w) / mousePos.w - (drag.x * w) / drag.w,
      (mousePos.y * h) / mousePos.h - (drag.y * h) / drag.h
    );
    _context.stroke();
  }

  function _strokeEnd(mouseX, mouseY) {
    lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
    if (!lineWidth) {
      lineWidth = prevlw;
    } else {
      prevlw = lineWidth;
    }
    if (type == "1") {
      writeUserData(roomName, tool, mouseX, mouseY, 0);
    }

    switch (tool) {
      case "pen":
        if (_mouseXStart === mouseX && _mouseYStart === mouseY) {
          var i,
            radius = _options.brushSize / 2;
          for (i = 0; i < _painters.length; i++) {
            _context.beginPath();
            _context.arc(mouseX, mouseY, radius, 0, 2 * Math.PI, false);
            _context.fillStyle = _context.strokeStyle;
            _context.fill();
            _context.lineWidth = 1;
            _context.strokeStyle = _context.strokeStyle;
            _context.stroke();
          }
        }
        if (type == "1") {
          if (!lineWidth) {
            lineWidth = 1;
          }
          points.push({
            x: mouseX,
            y: mouseY,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
        }
        if (type == "0") {
          resotreSnapShotCanvas();
        }
        break;
      case "straight":
        resotreSnapShotCanvas();
        if (type == "1") {
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          drawLine(position, dragingstrtLoc);
        }
        break;
      case "elipse":
        resotreSnapShotCanvas();
        if (type == "1") {
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          drawCircle(position, dragingstrtLoc);
        }
        break;
      case "rec":
        resotreSnapShotCanvas();
        if (type == "1") {
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          drawRec(position, dragingstrtLoc);
        }
        break;
      case "triangle":
        resotreSnapShotCanvas();
        if (type == "1") {
          var w = Math.abs(lowx - highx);
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - w - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - w - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          drawTriangle(position, dragingstrtLoc);
        }
        break;
      case "rohmbus":
        resotreSnapShotCanvas();
        if (type == "1") {
          var w = Math.abs(lowx - highx);
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - w - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - w - 30,
            ly: lowy - 30,
            hx: highx + 10,
            hy: highy + 10,
            text: null,
          });
          drawRohmbus(position, dragingstrtLoc);
        }
        break;
      case "arrow":
        resotreSnapShotCanvas();
        if (type == "1") {
          points.push({
            x: dragingstrtLoc.x,
            y: dragingstrtLoc.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 35,
            ly: lowy - 35,
            hx: highx + 15,
            hy: highy + 15,
            text: null,
          });
          points.push({
            x: position.x,
            y: position.y,
            z: tool,
            w: _canvas.clientWidth,
            h: _canvas.clientHeight,
            lw: lineWidth,
            lx: lowx - 35,
            ly: lowy - 35,
            hx: highx + 15,
            hy: highy + 15,
            text: null,
          });
          drawArrow(position, dragingstrtLoc);
        }
        break;
      case "drag":
        // resotreSnapShotCanvas();
        if (clicked) {
          pathsry.push(secPath);
          clicked = false;
          Redraw(currentPage - 1);
        } else {
          strtDrag = false;
          if (tempPoints.length != 0) {
            console.log(tempPoints);
            pathsry.push(tempPoints);
            // socket.emit('moved',selectedItem,tempPoints,Roomname,pagecount);
            // ctx.beginPath();
            // ctx.rect(tempPoints[tempPoints.length-1].lx,tempPoints[tempPoints.length-1].ly,tempPoints[tempPoints.length-1].hx-tempPoints[tempPoints.length-1].lx,tempPoints[tempPoints.length-1].hy-tempPoints[tempPoints.length-1].ly);
            // ctx.stroke();
          }
          if (type == "1") {
            const postListRef = ref(
              db,
              "/pages" + "/" + roomName + "/" + (previousPage - 1)
            );
            set(postListRef, pathsry);
          }
          // set(postListRef,pathsry )
          tempPoints = [];
          console.log(pathsry);
          lowx = 0;
          lowy = 0;
          highy = 0;
          highx = 0;
          points = [];
        }
        break;
      case "eraser":
        break;
    }
    if (type == "1") {
      if (points.length != 0) {
        console.log("hey");
        pathsry.push(points);
        console.log(points);
        //updating new drawings on firebase
        const postListRef = ref(
          db,
          "/pages" + "/" + roomName + "/" + (previousPage - 1)
        );
        // const newPostRef = push(postListRef);
        console.log("manoj");
        console.log(pathsry);
        set(postListRef, pathsry);

        // set(newPostRef, pages[previousPage-1]);
      }
      points = [];
    }

    // _context.beginPath();
    // _context.rect(lowx,lowy,highx-lowx,highy-lowy);
    // _context.stroke();
    lowx = 0;
    lowy = 0;
    highx = 0;
    highy = 0;
  }

  function _attachEventListeners() {
    var lastMove = null;

    var onCanvasMouseDown = function (event) {
        if (type == "1") {
          var canvasOffset = _offset(_canvas);
          _strokeStart(
            event.pageX - canvasOffset.left,
            event.pageY - canvasOffset.top
          );

          _canvas.addEventListener("mousemove", onCanvasMouseMove, false);
          _canvas.addEventListener("mouseup", onCanvasMouseUp, false);
        }
      },
      onCanvasMouseMove = function (event) {
        if (type == "1") {
          var canvasOffset = _offset(_canvas);
          _stroke(
            event.pageX - canvasOffset.left,
            event.pageY - canvasOffset.top
          );
        }
      },
      onCanvasMouseUp = function (event) {
        console.log(event.pageX);
        if (type == "1") {
          var canvasOffset = _offset(_canvas);
          // _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
          _strokeEnd(
            event.pageX - canvasOffset.left,
            event.pageY - canvasOffset.top
          );

          _canvas.removeEventListener("mousemove", onCanvasMouseMove, false);
          _canvas.removeEventListener("mouseup", onCanvasMouseUp, false);
        }
      },
      onCanvasTouchStart = function (event) {
        if (type == "1") {
          if (event.touches.length == 1) {
            event.preventDefault();
            lastMove = event;

            var canvasOffset = _offset(_canvas);
            _strokeStart(
              event.touches[0].pageX - canvasOffset.left,
              event.touches[0].pageY - canvasOffset.top
            );

            _canvas.addEventListener("touchmove", onCanvasTouchMove, false);
            _canvas.addEventListener("touchend", onCanvasTouchEnd, false);
          }
        }
      },
      onCanvasTouchMove = function (event) {
        if (type == "1") {
          if (event.touches.length == 1) {
            event.preventDefault();
            lastMove = event;
            var canvasOffset = _offset(_canvas);
            _stroke(
              event.touches[0].pageX - canvasOffset.left,
              event.touches[0].pageY - canvasOffset.top
            );
          }
        }
      },
      onCanvasTouchEnd = function (event) {
        if (type == "1") {
          if (event.touches.length === 0) {
            event.preventDefault();

            var canvasOffset = _offset(_canvas);
            // _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
            _strokeEnd(
              lastMove.touches[0].pageX - canvasOffset.left,
              lastMove.touches[0].pageY - canvasOffset.top
            );

            _canvas.removeEventListener("touchmove", onCanvasTouchMove, false);
            _canvas.removeEventListener("touchend", onCanvasTouchEnd, false);
          }
        }
      },
      onCanvasResize = function () {
        // _canvas.width    = _container.offsetWidth ? _container.offsetWidth : _canvasDefWidth;
        // _canvas.height   = _container.offsetHeight ? _container.offsetHeight : _canvasDefHeight;
      };

    if (type == "1") {
      _canvas.addEventListener("mousedown", onCanvasMouseDown, false);
      _canvas.addEventListener("touchstart", onCanvasTouchStart, false);
    }
    window.addEventListener("resize", onCanvasResize, false);

    onCanvasResize();
  }

  function _extend(object, properties) {
    var key, val;
    if (!object) {
      object = {};
    }
    if (!properties) {
      properties = {};
    }
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  }

  function _ensureRgb(color) {
    var colorsArray = [0, 0, 0];
    if (/^#./.test(color)) {
      colorsArray = _hexToRgbArray(color);
    } else if (/^rgb\(./.test(color)) {
      colorsArray = color
        .substring(4, color.length - 1)
        .replace(/ /g, "")
        .split(",");
    } else if (/^rgba\(./.test(color)) {
      colorsArray = color
        .substring(5, color.length - 1)
        .replace(/ /g, "")
        .split(",");
      colorsArray.pop();
    } else if (Object.prototype.toString.call(color) === "[object Array]") {
      colorsArray = color;
    }

    return colorsArray;
  }

  function _hexToRgbArray(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }

  function _offset(elem) {
    var docElem,
      win,
      box = { top: 0, left: 0 },
      doc = elem && elem.ownerDocument,
      isWindow = function (obj) {
        return obj !== null && obj === obj.window;
      },
      getWindow = function (elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
      };

    if (!doc) {
      return;
    }

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft,
    };
  }

  function drawCircle(mousePos, drag) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    var x1 = (drag.x * w) / drag.w;
    var y1 = (drag.y * h) / drag.h;
    var x2 = (mousePos.x * w) / mousePos.w;
    var y2 = (mousePos.y * h) / mousePos.h;
    var radiusX = (x2 - x1) * 0.5, /// radius for x based on input
      radiusY = (y2 - y1) * 0.5, /// radius for y based on input
      centerX = x1 + radiusX, /// calc center
      centerY = y1 + radiusY,
      step = 0.01, /// resolution of ellipse
      a = step, /// counter
      pi2 = Math.PI * 2 - step; /// end angle

    /// start a new path
    _context.beginPath();

    /// set start point at angle 0
    _context.moveTo(
      centerX + radiusX * Math.cos(0),
      centerY + radiusY * Math.sin(0)
    );

    /// create the ellipse
    for (; a < pi2; a += step) {
      _context.lineTo(
        centerX + radiusX * Math.cos(a),
        centerY + radiusY * Math.sin(a)
      );
    }

    /// close it and stroke it for demo
    _context.closePath();
    _context.stroke();
  }

  function drawAround(factx, facty) {
    var drag = { x: llx - factx, y: lly - facty };
    var mousePos = { x: hhx - factx, y: hhy - facty };
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    _context.lineWidth = "2";
    _context.beginPath();
    _context.setLineDash([5, 15]);
    _context.rect(drag.x, drag.y, Math.abs(hhx - llx), Math.abs(hhy - lly));
    _context.stroke();
    _context.setLineDash([]);
    _context.lineWidth = lineWidth;
  }

  function drawLine(mousePos, dragingstrtLoc) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    _context.beginPath();
    _context.moveTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w,
      (mousePos.y * h) / mousePos.h
    );
    _context.stroke();
  }

  function drawTriangle(mousePos, dragingstrtLoc) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    var half = mousePos.x - dragingstrtLoc.x;
    var othrx = dragingstrtLoc.x - half;
    //   console.log(mousePos.x,"  ", mousePos.y)
    //   console.log(mousePos.x,"  ",othry);
    _context.beginPath();
    _context.moveTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w,
      (mousePos.y * h) / mousePos.h
    );
    _context.lineTo((othrx * w) / mousePos.w, (mousePos.y * h) / mousePos.h);
    _context.lineTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.stroke();
  }
  function drawArrow(mousePos, dragingstrtLoc) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    var halfx = mousePos.x - dragingstrtLoc.x;
    var halfy = mousePos.y - dragingstrtLoc.y;
    var othry =
      dragingstrtLoc.y -
      ((mousePos.y * h) / mousePos.h - (halfy * h) / mousePos.h / 2);
    var halfpoint =
      (mousePos.x * w) / mousePos.w - (halfx * w) / mousePos.w / 2;
    var othrx = halfpoint - (dragingstrtLoc.x * w) / dragingstrtLoc.w;

    var headlen = 10; // length of head in pixels
    var dx = mousePos.x - dragingstrtLoc.x;
    var dy = mousePos.y - dragingstrtLoc.y;
    var angle = Math.atan2(dy, dx);
    _context.beginPath();
    _context.moveTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w,
      (mousePos.y * h) / mousePos.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w - headlen * Math.cos(angle - Math.PI / 6),
      (mousePos.y * h) / mousePos.h - headlen * Math.sin(angle - Math.PI / 6)
    );
    _context.moveTo(
      (mousePos.x * w) / mousePos.w,
      (mousePos.y * h) / mousePos.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w - headlen * Math.cos(angle + Math.PI / 6),
      (mousePos.y * h) / mousePos.h - headlen * Math.sin(angle + Math.PI / 6)
    );
    _context.stroke();
  }

  function drawRohmbus(mousePos, dragingstrtLoc) {
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    var halfx = mousePos.x - dragingstrtLoc.x;
    var halfy = mousePos.y - dragingstrtLoc.y;
    var othry =
      dragingstrtLoc.y -
      ((mousePos.y * h) / mousePos.h - (halfy * h) / mousePos.h / 2);
    var halfpoint =
      (mousePos.x * w) / mousePos.w - (halfx * w) / mousePos.w / 2;
    var othrx = halfpoint - (dragingstrtLoc.x * w) / dragingstrtLoc.w;

    //   console.log(mousePos.x,"  ", mousePos.y)
    //   console.log(mousePos.x,"  ",othry);
    _context.beginPath();
    _context.moveTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.lineTo(
      (mousePos.x * w) / mousePos.w - (halfx * w) / mousePos.w / 2,
      (mousePos.y * h) / mousePos.h - (halfy * h) / mousePos.h / 2
    );
    _context.lineTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (mousePos.y * h) / mousePos.h
    );
    _context.lineTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w - (othrx * w) / mousePos.w,
      (mousePos.y * h) / mousePos.h - (halfy * h) / mousePos.h / 2
    );
    _context.lineTo(
      (dragingstrtLoc.x * w) / dragingstrtLoc.w,
      (dragingstrtLoc.y * h) / dragingstrtLoc.h
    );
    _context.stroke();
  }

  function writeUserData(room, tool, x, y, s) {
    //   console.log(currentPage)
    if (s == 0) {
      set(ref(db, "/" + room), {
        tool: tool,
        x: 0,
        y: 0,
        s: s,
        p: previousPage,
        c: currentPage,
        ss: 0,
      });
    } else {
      set(ref(db, "/" + room), {
        tool: tool,
        x: x,
        y: y,
        s: s,
        p: previousPage,
        c: currentPage,
        ss: 0,
      });
    }
  }

  function getdrawings() {
    const postListRef = ref(
      db,
      "/pages" + "/" + roomName + "/" + (previousPage - 1)
    );

    onValue(
      ref(db, "/pages" + "/" + roomName),
      (snapshot) => {
        pages = snapshot.val();
        console.log(pages);
        if (pages != null) {
          if (typeof pages[0] != "undefined") {
            // Redraw(0);
          }
        }
      },
      {
        onlyOnce: true,
      }
    );

    // console.log(postListRef);
    // onValue(postListRef, (snapshot) => {
    //     pathsry = snapshot.val();
    //     if(pathsry!= null){
    //         var maxLineWidht = 0;//Math.max.apply(null, _brushSizes);
    //         for(var key in _brushSizes) {
    //             maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
    //         }

    //         pathsry.forEach(path=>{
    //             var k = path[0].z;
    //             switch(k){
    //                 case "pen":
    //                         var dx= path[0].x;
    //                         var dy = path[0].y;
    //                         var ax = 0;
    //                         var ay = 0;
    //                         var div= 0.1;
    //                         var ease= 0.7;
    //                         var prvx = 0;
    //                         var prvy = 0;
    //                         for(let i=0;i<path.length;i++){
    //                                         _context.beginPath();
    //                                         var lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;

    //                                         var x = prvx;
    //                                         var y = prvy;

    //                                         prvx = path[i].x;
    //                                         prvy = path[i].y;

    //                                         var delta = Math.abs(x - prvx);
    //                                         if ((_currentDelta !== null) && (2 <= Math.abs(_currentDelta - delta))) {
    //                                             _currentDelta = (_currentDelta < delta) ? (_currentDelta + 1) : (_currentDelta - 1);
    //                                         }
    //                                         else {
    //                                             _currentDelta = delta;
    //                                         }

    //                                         var xPrev = dx,
    //                                             yPrev = dy;

    //                                         ax = (ax + (dx - path[i].x) * div) * ease;
    //                                         dx -= ax;
    //                                         ay = (ay + (dy - path[i].y) * div) * ease;
    //                                         dy -= ay;

    //                                         // draw background line with opacity to smooth primaary line's edges
    //                                         // _context.strokeStyle =  makeStrokeStyle(0.001);
    //                                         // _context.lineWidth = lineWidth + 2;
    //                                         // _context.lineCap    = 'butt';
    //                                         // _context.lineJoin   = 'miter';

    //                                         // _context.moveTo(xPrev, yPrev);
    //                                         // _context.lineTo(dx,dy);
    //                                         // _context.stroke();

    //                                         //draw primary line without opacity
    //                                         _context.strokeStyle =  makeStrokeStyle(1);
    //                                         _context.lineWidth = lineWidth;
    //                                         _context.lineCap    = 'round';
    //                                         _context.lineJoin   = 'miter';

    //                                         _context.moveTo(xPrev, yPrev);
    //                                         _context.lineTo(dx,dy);
    //                                         _context.stroke();
    //                         }
    //                         // _context.beginPath();
    //                         // _context.moveTo(path[0].x,path[0].y);
    //                         // for(let i = 1; i < path.length; i++){
    //                         //     _context.lineTo(path[i].x,path[i].y);
    //                         // }
    //                         // _context.stroke();
    //                         // console.log(path)
    //                         // _strokeStart(path[0].x,path[0].y)
    //                         // for(var v=1;v<path.length-2;v++){
    //                         //     _stroke(path[v].x,path[v].y)
    //                         // }
    //                         // _strokeEnd(path[path.length-1].x,path[path.length-1].y);
    //                         break;
    //                 case "straight":
    //                     var mousePos = {x:path[1].x,y:path[1].y}
    //                     var dragingstrtLoc = {x:path[0].x,y:path[0].y}
    //                     drawLine(mousePos,dragingstrtLoc);
    //                     break;
    //                 case "elipse":
    //                     var mousePos = {x:path[1].x,y:path[1].y}
    //                     var dragingstrtLoc = {x:path[0].x,y:path[0].y}
    //                     drawCircle(mousePos,dragingstrtLoc);
    //                     break;
    //                 case "rec":
    //                     var mousePos = {x:path[1].x,y:path[1].y}
    //                     var dragingstrtLoc = {x:path[0].x,y:path[0].y}
    //                     drawRec(mousePos,dragingstrtLoc);
    //                     break;

    //             }
    //         })

    //     }
    // },{
    //     onlyOnce: true
    // });
  }

  function pageChangeOn(val) {
    console.log(previousPage, " ", val);
    console.log("hey  ", pages);
    onValue(
      ref(db, "/pages" + "/" + roomName),
      (snapshot) => {
        pages = snapshot.val();
        console.log(pages);
        if (pages != null) {
          if (typeof pages[0] != "undefined") {
          }
        }
      },
      {
        onlyOnce: true,
      }
    );

    var pos = previousPage - 1;
    if (pos < val) {
      if (pages == null) {
        console.log("new page");
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        pathsry = [];
        drawimage();
      } else {
        console.log(pages.length + "   hello" + val);
        if (pages.length < val) {
          console.log("new page");
          _context.clearRect(0, 0, _canvas.width, _canvas.height);
          _context.fillStyle = "#F3F6F9";
          _context.fillRect(0, 0, _canvas.width, _canvas.height);
          pathsry = [];
          drawimage();
        } else {
          console.log("after page");
          _context.clearRect(0, 0, _canvas.width, _canvas.height);
          _context.fillStyle = "#F3F6F9";
          _context.fillRect(0, 0, _canvas.width, _canvas.height);
          pathsry = [];
          Redraw(val - 1);
        }
      }
    } else {
      _context.clearRect(0, 0, _canvas.width, _canvas.height);
      console.log("before page");
      _context.fillStyle = "#F3F6F9";
      _context.fillRect(0, 0, _canvas.width, _canvas.height);
      pathsry = [];
      Redraw(val - 1);
    }
  }

  _init(inCanvas, inOptions);
}
