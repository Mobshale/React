
import React, { Component } from 'react';
import './ListUsers.css';


const ListUsers = (props) => {
  
  const name = props.name;
  

  return(
  
      <div className="messageContainer2 ">
        <div className="messageBox2 backgroundBlue2">
    <p className="messageText2 colorWhite2">{name}</p>
        </div>
      </div>

  )
    


}

export default ListUsers;