
import React, { Component } from 'react';
import './message.css';


const ChatMessage = (props) => {
  const {text, uid,uname} = props.messages;
  const id = props.id;
  
  
  const messageClass = uid === "1" ? true : false;
  console.log(messageClass);
  return(
    messageClass
    ? (
  
      <div className="messageContainer justifyEnd">
           <p>{uname}</p>
        <div className="messageBox backgroundBlue">
    <p className="messageText colorWhite">{text}</p>
        </div>
      </div>
      )
      : (
        <div className="messageContainer justifyStart">
          <p>{uname}</p>
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{text}</p>
          </div>
        </div>
      )
);

  //   /
  // )

}

export default ChatMessage;