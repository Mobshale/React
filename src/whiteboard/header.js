import React, { Component } from 'react';
import {Popover, Tooltip, Typography } from 'antd';
import 'antd/dist/antd.css';
import exit from "./image/exit.svg";
import "./header.css"
import { FundProjectionScreenOutlined, ShareAltOutlined } from '@ant-design/icons';
import { deleteApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import { getDatabase, ref, set,onValue,push, remove, get, child,update } from "firebase/database";
import { CopyOutlined } from '@ant-design/icons';
import {
  Button,
  Input,} from 'antd';



const { Title } = Typography;
var roomName,type
var app,db,sharelink;


class Header extends React.Component {

  constructor(props){
    super(props)
    roomName = props.roomName;
     type = props.teacher;

     console.log("hey teacher");
     console.log(type);

     sharelink = "https://web.mobshale.com/sishya/"+roomName+"/username/gss/gss" 

  
     
    app =initializeApp(firebaseConfig);
     db = getDatabase(app);

     


  }




    async startCapture () {
      if(type==1){
        const postRef = ref(db, '/' + roomName+"/ss");
        set(postRef,1);
        var tab = document.getElementById("sharescreen")
        tab.style.visibility = "visible" ;
      //   console.log(tab.style.visibility)
      //   const displayMediaOptions = {
      //     video: {
      //       cursor: "always"
      //     },
      //     audio: false
      //   };
      // let captureStream = null;
      
    
      // try {
      //   captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      // } catch (err) {
      //   console.error(`Error: ${err}`);
      // }
      // var video = document.getElementById('screen-video-teach');
      // video.srcObject = captureStream
      }
    

      
  }



  render(){

    const content = (
      <div>
        <Input.Group compact>
        <Input
          style={{ width: '200px'
            // 'calc(100% - 200px)'
           }}
          defaultValue={sharelink}
        />
        <Tooltip title="copy git url">
          <Button  onClick={() => {navigator.clipboard.writeText(sharelink)}} icon={<CopyOutlined />} />
        </Tooltip>
      </Input.Group>
      </div>
    );
  
    return (
     <div class="header-tab">
         <Title level={3}  style={{fontFamily:"sans-serif", textAlign:"center" , marginLeft:"10px", marginTop:"4px"}}>mobshale  </Title>
        
        <div class="sharescreen-btn">
        <div  class="draw-headerbox-box-cell">
        <div id="tool-headerbox-cell-screen" class="tool-headerbox-cell"  onClick={this.startCapture}>
        <Tooltip placement="bottomRight" title={<span>Share screen</span>}>
          <FundProjectionScreenOutlined style={{fontSize:"20px"}} />
          </Tooltip>
        </div>
         
        </div>
        </div>

        <div class="sharelink-btn">
        <div  class="draw-headerbox-box-cell">
        <div id="tool-headerbox-cell" class="tool-headerbox-cell"  >
        <Popover placement="bottomRight" title={"Share link"} content={content} trigger="hover">
        <ShareAltOutlined  style={{fontSize:"20px"}} />
         </Popover>
       
        </div>
         
        </div>
        </div>
        
         <div class="right">
        

         <Tooltip placement="bottomRight" title={<span>End Class</span>}>
          <img class="exit"   src={exit}   alt="End class"></img>
        </Tooltip>
        
        
         </div>
       
     </div>
     
     );
    }

  
}




export default Header;
