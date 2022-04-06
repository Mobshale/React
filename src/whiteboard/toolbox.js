import React, { Component } from 'react';
import './toolbox.css'
import {Popover, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import selector from "./image/selector.svg";
import  selectorActive from "./image/selector-active.svg";
import pen from "./image/pencil.svg";
import penActive from "./image/pencil-active.svg";
import text from "./image/text.svg";
import textActive from "./image/text-active.svg";
import eraser from "./image/eraser.svg";
import eraserActive from "./image/eraser-active.svg";
import arrow from "./image/arrow.svg";
import arrowActive from "./image/arrow-active.svg";
import laserPointer from "./image/laserPointer.svg";
import laserPointerActive from "./image/laserPointer-active.svg";
import hand from "./image/hand.svg";
import handActive from "./image/hand-active.svg";
import ellipse from "./image/ellipse.svg";
import ellipseActive from "./image/ellipse-active.svg";
import rectangle from "./image/rectangle.svg";
import rectangleActive from "./image/rectangle-active.svg";
import straight from "./image/straight.svg";
import straightActive from "./image/straight-active.svg";
import subscript from "./image/subscript.svg";
import subscriptActive from "./image/subscript-active.svg";
import clear from "./image/clear.svg";
import clearActive from "./image/clear-active.svg";
import click from "./image/click.svg";
import clickActive from "./image/click-active.svg";
import triangle from "./image/triangle.svg";
import triangleActive from "./image/triangle-active.svg";
import rhombus from "./image/rhombus.svg";
import rhombusActive from "./image/rhombus-active.svg";
import pentagram from "./image/pentagram.svg";
import pentagramActive from "./image/pentagram-active.svg";
import speechBalloon from "./image/speechBalloon.svg";
import speechBalloonActive from "./image/speechBalloon-active.svg";
import { MContext } from './MyProvider';

class Toolbox extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      clicked : "pen"
    }
    
  }


  



  
   imageClick = (v,context) => {
      this.setState(
        {clicked: v }
        
      );


      context.setMessage(v);


  } 

  


  render(){
    


    const pencontent = (
      <div class="draw-tool-box">

   
   


        <div  class="draw-tool-box-cell">
        <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "pen" ? penActive: pen} onClick={ this.imageClick.bind(this,"pen",context)} ></img>
          )}
      </MContext.Consumer>
        </div>
    
        <div  class="draw-tool-box-cell">
        <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "elipse" ? ellipseActive : ellipse} onClick={ this.imageClick.bind(this,"elipse",context)} ></img>
          )}
      </MContext.Consumer>
        </div>

        <div  class="draw-tool-box-cell">
        <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "rec" ? rectangleActive : rectangle} onClick={ this.imageClick.bind(this,"rec",context)} ></img>
        
          )}
          </MContext.Consumer>
          </div>

        <div  class="draw-tool-box-cell">
          <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "straight" ? straightActive : straight} onClick={ this.imageClick.bind(this,"straight",context)} ></img>
          )}
          </MContext.Consumer>
          </div>

         <div  class="draw-tool-box-cell">
        <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "triangle" ? triangleActive : triangle} onClick={ this.imageClick.bind(this,"triangle",context)} ></img>
          )}
          </MContext.Consumer>
          </div>

         <div  class="draw-tool-box-cell">
           <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "rohmbus" ? rhombusActive : rhombus} onClick={ this.imageClick.bind(this,"rohmbus",context)} ></img>
          )}
          </MContext.Consumer>
          </div>      

        <div  class="draw-tool-box-cell">
          <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "speech" ? speechBalloonActive : speechBalloon} onClick={ this.imageClick.bind(this,"speech",context)} ></img>
          )}
          </MContext.Consumer>
          </div>  


        <div  class="draw-tool-box-cell">
          <MContext.Consumer>
        {(context) => (
          <img src={this.state.clicked== "pentagram" ? pentagramActive : pentagram} onClick={ this.imageClick.bind(this,"pentagram",context)} ></img>
          )}
          </MContext.Consumer>
          </div>  


        



      </div>
    );


  return (
    
    <div class="tool-mid-box-left">

      


     

      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell" >
      <MContext.Consumer>
        {(context) => (
        <Tooltip placement="right" title={<span>Clicker</span>}>
             <img   src={this.state.clicked== "click" ? clickActive: click} onClick={ this.imageClick.bind(this,"click",context)}  alt="click"></img>
        </Tooltip>
         )}
         </MContext.Consumer>
        </div>
      </div>
      


      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
        <Tooltip placement="right" title={<span>Selector</span>}>
             <img   src={this.state.clicked== "selector" ? selectorActive: selector} onClick={ this.imageClick.bind(this,"selector",context)}  alt="selector"></img>
        </Tooltip>
         )}
         </MContext.Consumer>
        </div>
      </div>

      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Popover placement="left"  content={pencontent} trigger="hover">
      <img   src={this.state.clicked== "pen"? penActive: pen} onClick={ this.imageClick.bind(this,"pen",context)}  alt="selector"></img>
      </Popover>
       )}
       </MContext.Consumer>
        </div>
      </div>

      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Text</span>}>
      <img   src={this.state.clicked== "text"? textActive: text} onClick={ this.imageClick.bind(this,"text",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>

      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Eraser</span>}>
      <img   src={this.state.clicked== "eraser"? eraserActive: eraser} onClick={ this.imageClick.bind(this,"eraser",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>


      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Arrow</span>}>
      <img   src={this.state.clicked== "arrow"? arrowActive: arrow} onClick={ this.imageClick.bind(this,"arrow",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>


      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Laser Pointer</span>}>
      <img   src={this.state.clicked== "laser"?laserPointerActive : laserPointer} onClick={ this.imageClick.bind(this,"laser",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>


      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Drag</span>}>
      <img   src={this.state.clicked== "drag"? handActive: hand} onClick={ this.imageClick.bind(this,"drag",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>


      <div class="tool-box-cell-box-left">
      <div class="tool-box-cell">
      <MContext.Consumer>
        {(context) => (
      <Tooltip placement="right" title={<span>Clear</span>}>
      <img   src={this.state.clicked== "clear"? clearActive: clear} onClick={ this.imageClick.bind(this,"clear",context)}  alt="selector"></img>
      </Tooltip>
       )}
       </MContext.Consumer>
        </div>
      </div>


 


    </div>
  

  );
  }
  
}

export default Toolbox;
