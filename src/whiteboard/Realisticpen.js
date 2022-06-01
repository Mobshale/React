/**
* canvas-realistic-pen@1.0.0
*
* Library for smooth pen-like drawing on canvas
* 
* This is refactored and enhanced version of code taken from this post: http://stackoverflow.com/a/10661872/2248909
*
* Authors: 
*   - mrdob.com
*   - Alex <http://stackoverflow.com/users/873836/alex>
*   - Alexey Pedyashev
* 
* Options:
*   penColor       -  Color of the pen. Allowed formats: 
*                     Array - [0, 0, 0], Hex - #ccc, #cfc4c1, rgb(1, 2, 3), rgba(1, 2, 3, 0)
*   brushSize:     - widht of line
*
* Interface:
*   destroy()                           - destroys the pen
*   setPenColor(inColor)                - sets penColor 
*   setBrushSize(inBrushSize)           - sets brushSize
*
* Example:
*   var canvas          = document.getElementById('draw-canvas');
*   brush = new RealisticPen(canvas, {
*       penColor: [217, 101, 110],
*       brushSize: 3,
*   });
*
*/
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "../main/firebaseCon";
import { getDatabase, ref, set,onValue,push, remove, get, child } from "firebase/database";
import {  onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";




export function RealisticPen(inCanvas, inOptions, tol, roomName,type) {

    console.log(roomName)
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    var wirtng = 0;
    var prev = null;
    var pptlist  = [];
    var imagesbase = [];
    var base64 = [];
    console.log(tol);

  



    const pptRef = ref(db, 'ppt/' + roomName);
    onValue(pptRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            pptlist.push(childSnapshot.val());
        });
        for(var i =0; i<pptlist.length;i++){
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
        _prevCoords = {
            x: null,
            y: null
        },
        tool=tol,
        _currentDelta = null,
        _painters = null,
        _updateInterval = null,
        _canvas = null,
        _container = null,
        _canvasDefWidth = 200,
        _canvasDefHeight = 200,
        _options = {
            penColor: [0, 0, 0],
            brushSize: 3
        },
        pages = [],
        previousPage =1,
        lineWidth = 1,
        prevlw =lineWidth,
        currentPage = 1,
        pathsry = [],
        points =[],
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
          50: 1
      };



      var maxLineWidht = 0;//Math.max.apply(null, _brushSizes);
        for(var key in _brushSizes) {
            maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
        }
        
      // checking if the user is teacher or student teacher =1 , student =0
      if(type == "0"){
        onValue(ref(db, '/pages'+'/'+roomName), (snapshot) => {
            var pstry;
            pstry = snapshot.val();
            if(pstry!= null){
                pages = pstry;
                console.log(pages);
                if(pages[currentPage-1]!=null){
                    if (typeof(pages[currentPage-1]) != "undefined"){
                        _context.clearRect(0, 0, _canvas.width, _canvas.height);
                        _context.fillStyle = "#F3F6F9";
                        _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
                        Redraw(currentPage-1);
                    }
                }
            }
           
            
          }
        //   , {
        //     onlyOnce: true
        //   }
          );


        const starCountRef = ref(db, '/' + roomName );
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data.tool)
            var w = _canvas.clientWidth;
            var h = _canvas.clientHeight;
            if(data != null){
                tool = data.tool;
                previousPage= data.p;
            
            if(currentPage!= data.c){
                currentPage = data.c;
                drawimage();
                pageChangeOn(currentPage);
        
            }
            switch(data.s){
                case 0:
                    wirtng = 0
                    if(prev!= null){
                        _strokeEnd((data.x)*w/data.w, ((data.y)*h)/data.h);
                        // getdrawings();
                    }
                    break;
                case 1:
                    if(wirtng == 0){
                        _strokeStart((data.x)*w/data.w, ((data.y)*h)/data.h);
                        wirtng =1;
                    }else{
                        _stroke((data.x)*w/data.w, ((data.y)*h)/data.h);
                    }
                    break;
                case 2:
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
    

    window.onresize = function(event) {
        var w,h;
        w= document.body.clientWidth;
        h = document.body.clientHeight;
        _context.canvas.width = w;
        _context.canvas.height =h;
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
        if(pathsry!= null){
            pages[currentPage-1] = pathsry;
             Redraw(currentPage-1);
        }
        

        
      }





     

    this.destroy = function() {
        clearInterval(_updateInterval);

    };
    this.updateTool = function(toolU) {
        tool =toolU;
        console.log(tool);
    }

    this.clear = function(toolU) {
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.clientHeight);
        writeUserData(roomName,tool,0,0,2);
        //deleting the page on server
        const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
        // const newPostRef = push(postListRef);
        remove(postListRef)
        // set(newPostRef, pages[previousPage-1]);
        drawimage();
        pathsry = [];
    }
    

    this.setPenColor = function(inColor) {
        _options.penColor = _ensureRgb(inColor);
    };

    this.setBrushSize = function(inBrushSize) {
        _options.brushSize = inBrushSize;
    };

    this.setNewPage = function () {
       
    }

    // when a teacher chages the page on whiteboard
    this.pageChange = function (val) {
        currentPage = val;
        writeUserData(roomName,tool,0,0,3);

       console.log(pages);
        if(previousPage<val){
            if(pages.length<val){
                
                console.log("new page")
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
                _context.fillStyle = "#F3F6F9";
                _context.fillRect(0, 0, _canvas.width, _canvas.height);
                pages[previousPage-1]= pathsry;
                const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
                // const newPostRef = push(postListRef);
                set(postListRef,pages[previousPage-1] );
                // set(newPostRef, pages[previousPage-1]);
                pathsry = [];
                drawimage();
            }else{
                console.log("after page")
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
                _context.fillStyle = "#F3F6F9";
                _context.fillRect(0, 0, _canvas.width, _canvas.height);
                pages[previousPage-1]= pathsry;
                const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
                // const newPostRef = push(postListRef);
                set(postListRef,pages[previousPage-1] );
                // set(newPostRef, pages[previousPage-1]);
                pathsry = [];
                Redraw(previousPage);

            }
            previousPage= val;
        }else{
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            console.log("before page")
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            pages[previousPage-1]= pathsry;
            const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
            // const newPostRef = push(postListRef);
            set(postListRef,pages[previousPage-1] );
            // set(newPostRef, pages[previousPage-1]);
            pathsry = [];
            Redraw(previousPage-2);
            previousPage= val;
        }
    }

    function makeStrokeStyle(inOpacity){
        var opacity = inOpacity ? inOpacity : 1 ;
        return "rgba(" + _options.penColor[0] + ", " + 
            _options.penColor[1] + ", " + _options.penColor[2] + ",  " + opacity + ")";
    }

    // redrawing the previous page
    function Redraw(val) {
        console.log("page ",val);
        if(pages!= null){
            pathsry = pages[val];
        console.log(pathsry);
        }
        
        if (typeof pathsry == 'undefined'){
            console.log("new page")
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            pathsry = [];
            drawimage();
            return;
        }
        var maxLineWidht = 0;//Math.max.apply(null, _brushSizes);
        for(var key in _brushSizes) {
            maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
        }
        drawimage();
        pathsry.forEach(path=>{
            var k = path[0].z;
            switch(k){
                
                case "pen":
                    var dx= path[0].x;
                    var dy = path[0].y; 
                    var ax = 0;
                    var ay = 0; 
                    var div= 0.1;
                    var ease= 0.7;
                    var prvx = 0;
                    var prvy = 0; 
                    for(let i=0;i<path.length;i++){
                                    _context.beginPath();
                                    var lineWidth = path[i].lw;

                                    var x = prvx;
                                    var y = prvy;
                            
                                    prvx = path[i].x;
                                    prvy = path[i].y;
                            
                            
                                    var delta = Math.abs(x - prvx);
                                    if ((_currentDelta !== null) && (2 <= Math.abs(_currentDelta - delta))) {
                                         _currentDelta = (_currentDelta < delta) ? (_currentDelta + 1) : (_currentDelta - 1); 
                                    }
                                    else {
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
                                    _context.strokeStyle =  makeStrokeStyle(1);
                                    _context.lineWidth = lineWidth;
                                    _context.lineCap    = 'round'; 
                                    _context.lineJoin   = 'miter';

                                    var w = _canvas.clientWidth;
                                    var h = _canvas.clientHeight;
                                    _context.moveTo((xPrev)*w/path[i].w, ((yPrev)*h)/path[i].h);
                                    _context.lineTo((dx)*w/path[i].w, ((dy)*h)/path[i].h);
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
                    var mousePos = {x:path[1].x,y:path[1].y,w:path[1].w,h:path[1].h}
                    var dragingstrtLoc = {x:path[0].x,y:path[0].y,w:path[0].w,h:path[0].h}
                    drawLine(mousePos,dragingstrtLoc);
                    break;
                case "elipse":
                    _context.lineWidth = path[0].lw;
                    var mousePos = {x:path[1].x,y:path[1].y,w:path[1].w,h:path[1].h}
                    var dragingstrtLoc = {x:path[0].x,y:path[0].y,w:path[0].w,h:path[0].h}
                    drawCircle(mousePos,dragingstrtLoc);
                    break;
                case "rec":
                    _context.lineWidth = path[0].lw;
                    var mousePos = {x:path[1].x,y:path[1].y,w:path[1].w,h:path[1].h}
                    var dragingstrtLoc = {x:path[0].x,y:path[0].y,w:path[0].w,h:path[0].h}
                    drawRec(mousePos,dragingstrtLoc);
                    break;

            }
        })

        

        
    }


    function lop(i) {


        imagesbase[i] = new Image;
        imagesbase[i].src = pptlist[i];
        imagesbase[i].setAttribute('crossOrigin', '');
            imagesbase[i].onload = function(){
            //  ctx.drawImage(imagesbase[i], 40,0,w,h); 
       }
      
    }

    


    function drawimage(){

        console.log(currentPage-1);
        if(pptlist[currentPage-1]){
          
          
        var w = _canvas.clientWidth -80;
        var h = _canvas.clientHeight;
          
        base64[currentPage-1] = _canvas.todataUrl;
        
        imagesbase[currentPage-1].onload = function(){
          console.log("jfks")
            _context.drawImage(imagesbase[currentPage-1], 40,10,w/1.35,h/1.1);
        }
        // imagesbase[pagecount].crossOrigin = "anonymous";
        _context.drawImage(imagesbase[currentPage-1], 40,10,w/1.35,h/1.1);
      
        // if(imagesbase[pagecount+1]){
        //     ctx.drawImage(imagesbase[pagecount+1], w+10,0,50,50);
        // }
          console.log(currentPage-1)
                    
              
        }
    }

    function _init( inCanvas, inOptions ) {
        // _container = inCanvas.parentNode;

        if (inOptions) {
            _options = _extend(_options, inOptions);    
        }

        _options.penColor = _ensureRgb(_options.penColor);
        
        

        _canvas  = inCanvas;
        _context = _canvas.getContext("2d");

        _attachEventListeners();

        _context.globalCompositeOperation = 'source-over';
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
                ease: 0.7
            }); 
        }

        // _updateInterval = setInterval(update, 1000/90);
         _updateInterval = setInterval(update, 1000/90);

        
        function makeStrokeStyle(inOpacity){
            var opacity = inOpacity ? inOpacity : 1 ;
            return "rgba(" + _options.penColor[0] + ", " + 
                _options.penColor[1] + ", " + _options.penColor[2] + ",  " + opacity + ")";
        }

        var maxLineWidht = 0;//Math.max.apply(null, _brushSizes);
        for(var key in _brushSizes) {
            maxLineWidht = Math.max(maxLineWidht, _brushSizes[key]);
        }

        function update() {
             lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
                


            for (var i = 0; i < _painters.length; i++) {
                _context.beginPath();

                var xPrev = _painters[i].dx,
                    yPrev = _painters[i].dy;

                _painters[i].ax = (_painters[i].ax + (_painters[i].dx - _mouseX) * _painters[i].div) * _painters[i].ease;
                _painters[i].dx -= _painters[i].ax;
                _painters[i].ay = (_painters[i].ay + (_painters[i].dy - _mouseY) * _painters[i].div) * _painters[i].ease;
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
                _context.strokeStyle =  makeStrokeStyle(1);
                _context.lineWidth = lineWidth;
                _context.lineCap    = 'round'; 
                _context.lineJoin   = 'miter';

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
        _context.putImageData(snapshot,0,0);
    }

    function _strokeStart(mouseX, mouseY) {
        lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
        if(!lineWidth){
            lineWidth=prevlw;
        }else{
            prevlw=lineWidth;
        }

        if(type == "1"){
            writeUserData(roomName,tool,mouseX,mouseY,1)
        }
        switch(tool){
            case "pen":
                if(type == "0"){
                    takeSnapShotCanvas();
                }
                _mouseXStart = _mouseX = mouseX;
                _mouseYStart = _mouseY = mouseY;
                if(type == "1"){
                    
                    points.push({x:mouseX,y:mouseY,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                }
               
                for (var i = 0; i < _painters.length; i++) {
                    _painters[i].dx = mouseX;
                    _painters[i].dy = mouseY;
                }
                break;
            case "straight":
                dragingstrtLoc = {x:mouseX,y:mouseY,w:_canvas.clientWidth,h:_canvas.clientHeight}
                takeSnapShotCanvas();
                break;
            case "elipse":
                dragingstrtLoc = {x:mouseX,y:mouseY,w:_canvas.clientWidth,h:_canvas.clientHeight}
                takeSnapShotCanvas();
                break;
            case "rec":
                dragingstrtLoc = {x:mouseX,y:mouseY,w:_canvas.clientWidth,h:_canvas.clientHeight}
                takeSnapShotCanvas();
                break;


        }
       
        

        
    }

    function _stroke( mouseX, mouseY ) {
        lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
        if(!lineWidth){
            lineWidth=prevlw;
        }else{
            prevlw=lineWidth;
        }
        if(type == "1"){
            writeUserData(roomName,tool,mouseX,mouseY,1)
        }
        switch(tool){
            case 'pen':
                _prevCoords.x = _mouseX;
                _prevCoords.y = _mouseY;
        
                _mouseX = mouseX;
                _mouseY = mouseY;
        
        
                var delta = Math.abs(_prevCoords.x - _mouseX);
                if ((_currentDelta !== null) && (2 <= Math.abs(_currentDelta - delta))) {
                     _currentDelta = (_currentDelta < delta) ? (_currentDelta + 1) : (_currentDelta - 1); 
                }
                else {
                    _currentDelta = delta;
                }
                if(type == "1"){
                    points.push({x:mouseX,y:mouseY,z:tool,w:_canvas.width,h:_canvas.height,lw:lineWidth})
                }
                break;
            case 'straight':
                resotreSnapShotCanvas();
                 position = {x:mouseX,y:mouseY,z:tool,w:_canvas.width,h:_canvas.height,lw:lineWidth}
                drawLine(position,dragingstrtLoc);
                break;
            case "elipse":
                resotreSnapShotCanvas();
                position = { x:mouseX,y:mouseY,z:tool,w:_canvas.width,h:_canvas.height,lw:lineWidth}
                drawCircle(position,dragingstrtLoc);
                break;
            case "rec":
                resotreSnapShotCanvas();
                position = {x:mouseX,y:mouseY,z:tool,w:_canvas.width,h:_canvas.height,lw:lineWidth}
                drawRec(position,dragingstrtLoc);
                break;
        }
       
    }


    function drawRec(mousePos,drag){
        var w = _canvas.clientWidth;
        var h = _canvas.clientHeight;
        _context.beginPath();
        _context.rect((drag.x*w)/drag.w,(drag.y*h)/drag.h,(mousePos.x*w)/mousePos.w-(drag.x*w)/drag.w,(mousePos.y*h)/mousePos.h-(drag.y*h)/drag.h);
        _context.stroke();
      }
    

    function _strokeEnd(mouseX, mouseY) {
        lineWidth = _brushSizes[_currentDelta] + _options.brushSize / maxLineWidht;
        if(!lineWidth){
            lineWidth=prevlw;
        }else{
            prevlw=lineWidth;
        }
        if(type == "1"){
            writeUserData(roomName,tool,mouseX,mouseY,0)
        }

        switch(tool){
            case 'pen':
                if ((_mouseXStart === mouseX) && (_mouseYStart === mouseY) ){ 
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
                if(type == "1"){
                    if(!lineWidth){
                        lineWidth=1;
                    }
                    points.push({x:mouseX,y:mouseY,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                }
                if(type == "0"){
                    resotreSnapShotCanvas();
                }
                break;
            case 'straight':
                resotreSnapShotCanvas();
                if(type == "1"){
                    points.push({x:dragingstrtLoc.x,y:dragingstrtLoc.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    points.push({x:position.x,y:position.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    drawLine(position,dragingstrtLoc)
                }
                break;
            case "elipse":
                resotreSnapShotCanvas();
                if(type == "1"){
                    points.push({x:dragingstrtLoc.x,y:dragingstrtLoc.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    points.push({x:position.x,y:position.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    drawCircle(position,dragingstrtLoc);
                }
                break;
            case "rec":
                resotreSnapShotCanvas();
                if(type == "1"){
                    points.push({x:dragingstrtLoc.x,y:dragingstrtLoc.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    points.push({x:position.x,y:position.y,z:tool,w:_canvas.clientWidth,h:_canvas.clientHeight,lw:lineWidth})
                    drawRec(position,dragingstrtLoc);
                }
                break;

            
        }
        if(type == "1"){
            if(points.length != 0 ){
                pathsry.push(points);
                console.log(points);

    
                //updating new drawings on firebase
                const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
                // const newPostRef = push(postListRef);
                set(postListRef,pathsry );
                // set(newPostRef, pages[previousPage-1]);
              }
              points = [];
        }
        
       
        
       
    }

    function _attachEventListeners() {
        var lastMove = null;
        var onCanvasMouseDown = function(event) {
                if(type=="1"){
                var canvasOffset = _offset(_canvas);
                _strokeStart(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                
                    _canvas.addEventListener('mousemove', onCanvasMouseMove, false);
                    _canvas.addEventListener('mouseup',   onCanvasMouseUp, false);
                }
               
            },
            onCanvasMouseMove = function(event) {  
                if(type=="1"){
                var canvasOffset = _offset(_canvas);  
                _stroke(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                }
            },
            onCanvasMouseUp = function(event) {
                console.log(event.pageX);
                if(type=="1"){
                var canvasOffset = _offset(_canvas); 
                // _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top );

                _canvas.removeEventListener('mousemove', onCanvasMouseMove, false);
                _canvas.removeEventListener('mouseup',   onCanvasMouseUp,   false);
                }
            },
            onCanvasTouchStart = function(event) {
                if(type=="1"){
                if(event.touches.length == 1) {
                    event.preventDefault();
                    lastMove = event;
                    
                    var canvasOffset = _offset(_canvas);
                    _strokeStart( event.touches[0].pageX - canvasOffset.left, event.touches[0].pageY  - canvasOffset.top);
                    
                    _canvas.addEventListener('touchmove', onCanvasTouchMove, false);
                    _canvas.addEventListener('touchend', onCanvasTouchEnd, false);
                }
                }
            },
            onCanvasTouchMove = function(event) {
                if(type=="1"){
                if(event.touches.length == 1) {
                    event.preventDefault();
                    lastMove = event
                    var canvasOffset = _offset(_canvas);
                    _stroke( event.touches[0].pageX - canvasOffset.left, event.touches[0].pageY  - canvasOffset.top);
                }
                }
            },
            onCanvasTouchEnd = function(event) {
                if(type=="1"){
                if(event.touches.length === 0) {
                    event.preventDefault();
                
                    var canvasOffset = _offset(_canvas); 
                    // _strokeEnd(event.pageX - canvasOffset.left, event.pageY  - canvasOffset.top);
                    _strokeEnd(lastMove.touches[0].pageX - canvasOffset.left, lastMove.touches[0].pageY  - canvasOffset.top);

                    _canvas.removeEventListener('touchmove', onCanvasTouchMove, false);
                    _canvas.removeEventListener('touchend', onCanvasTouchEnd, false);
                }
                }
            },
            onCanvasResize = function() {
                // _canvas.width    = _container.offsetWidth ? _container.offsetWidth : _canvasDefWidth;
                // _canvas.height   = _container.offsetHeight ? _container.offsetHeight : _canvasDefHeight;
            };

            if(type=="1"){
        _canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        _canvas.addEventListener('touchstart', onCanvasTouchStart, false);
            }
        window.addEventListener('resize', onCanvasResize, false);

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

    function _ensureRgb(color){
        var colorsArray = [0, 0, 0];
        if (/^#./.test(color)) {
            colorsArray = _hexToRgbArray(color);
        }
        else if (/^rgb\(./.test(color)) {
            colorsArray = color.substring(4, color.length-1)
                 .replace(/ /g, '')
                 .split(',');
        }
        else if (/^rgba\(./.test(color)) {
            colorsArray = color.substring(5, color.length-1)
                 .replace(/ /g, '')
                 .split(',');
            colorsArray.pop();
        }
        else if(Object.prototype.toString.call( color ) === '[object Array]' ) {
            colorsArray = color;
        }

        return colorsArray;
    }

    function _hexToRgbArray(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
    }

    function _offset(elem) {
        var docElem, win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument,
            isWindow = function( obj ) {
                return obj !== null && obj === obj.window;
            },
            getWindow = function ( elem ) {
                return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
            };

        if (!doc) {
            return;
        }

        docElem = doc.documentElement;

        if ( typeof elem.getBoundingClientRect !== typeof undefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }


        
function drawCircle(mousePos,drag){
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    var x1 = (drag.x*w)/drag.w;
    var y1 = (drag.y*h)/drag.h;
    var x2 = (mousePos.x*w)/mousePos.w;
    var y2 = (mousePos.y*h)/mousePos.h;
    var radiusX = (x2 - x1) * 0.5,   /// radius for x based on input
    radiusY = (y2 - y1) * 0.5,   /// radius for y based on input
    centerX = x1 + radiusX,      /// calc center
    centerY = y1 + radiusY,
    step = 0.01,                 /// resolution of ellipse
    a = step,                    /// counter
    pi2 = Math.PI * 2 - step;    /// end angle
  
  /// start a new path
  _context.beginPath();
  
  /// set start point at angle 0
  _context.moveTo(centerX + radiusX * Math.cos(0),
           centerY + radiusY * Math.sin(0));
  
  /// create the ellipse    
  for(; a < pi2; a += step) {
    _context.lineTo(centerX + radiusX * Math.cos(a),
               centerY + radiusY * Math.sin(a));
  }
  
  /// close it and stroke it for demo
  _context.closePath();
  _context.stroke();
  }



  function drawLine(mousePos,dragingstrtLoc){
    var w = _canvas.clientWidth;
    var h = _canvas.clientHeight;
    _context.beginPath();
    _context.moveTo((dragingstrtLoc.x*w)/dragingstrtLoc.w,(dragingstrtLoc.y*h)/dragingstrtLoc.h)
    _context.lineTo((mousePos.x*w)/mousePos.w,(mousePos.y*h)/mousePos.h)
    _context.stroke();
  }


  function writeUserData(room, tool, x,y,s) {
    //   console.log(currentPage) 
       if(s == 0){
        set(ref(db, '/' + room), {
            tool: tool,
            x: 0,
            y: 0,
            s: s,
            p: previousPage,
            c: currentPage
            
          });
    }else{
        set(ref(db, '/' + room), {
            tool: tool,
            x: x,
            y: y,
            s: s,
            p: previousPage,
            c: currentPage

          });
    }
    
  }


  function getdrawings() {
    const postListRef = ref(db, '/pages'+'/'+roomName+'/'+(previousPage-1));
    
    onValue(ref(db, '/pages'+'/'+roomName), (snapshot) => {
        pages = snapshot.val();
        console.log(pages);
        if(pages!=null){
            
            if (typeof(pages[0]) != "undefined"){
                // Redraw(0);
            }
        }
        
      }, {
        onlyOnce: true
      });

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
      console.log(previousPage," ",val);
      console.log("hey  ",pages);
      onValue(ref(db, '/pages'+'/'+roomName), (snapshot) => {
        pages = snapshot.val();
        console.log(pages);
        if(pages!=null){
            if (typeof(pages[0]) != "undefined"){
            }
        }
        
      }, {
        onlyOnce: true
      });

      var pos = previousPage-1;
    if(pos<val){
        if(pages==null){
            console.log("new page")
            _context.clearRect(0, 0, _canvas.width, _canvas.height);
            _context.fillStyle = "#F3F6F9";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            pathsry = [];
            drawimage();
        }else{
            console.log(pages.length+ "   hello" +val );
            if(pages.length<val){
                console.log("new page")
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
                _context.fillStyle = "#F3F6F9";
                _context.fillRect(0, 0, _canvas.width, _canvas.height);
                pathsry = [];
                drawimage();
            }else{
                console.log("after page")
                _context.clearRect(0, 0, _canvas.width, _canvas.height);
                _context.fillStyle = "#F3F6F9";
                _context.fillRect(0, 0, _canvas.width, _canvas.height);
                pathsry = [];
                Redraw(val-1);
            }
        }
        
    }else{
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        console.log("before page")
        _context.fillStyle = "#F3F6F9";
        _context.fillRect(0, 0, _canvas.width, _canvas.height);
        pathsry = [];
        Redraw(val-1);
    }
  }















    _init(inCanvas, inOptions);
}
 