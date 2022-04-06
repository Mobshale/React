import React, { Component } from 'react';
import {Popover, Tooltip, Typography } from 'antd';
import 'antd/dist/antd.css';
import exit from "./image/exit.svg";
import "./header.css"


const { Title } = Typography;


class Header extends React.Component {

  constructor(props){
    super(props)
    
  }


  



  


  


  render(){
  
    return (
     <div class="header-tab">
         <Title level={3}  style={{fontFamily:"sans-serif", textAlign:"center" , marginLeft:"10px", marginTop:"4px"}}>mobshale  </Title>
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
