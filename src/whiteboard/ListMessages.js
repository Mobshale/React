
import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import ScrollToBottom from 'react-scroll-to-bottom';
import './ListMessage.css'


const ListMessage = (props) => {
    const messages = props.messages;
    const id = props.id;

    return(
    
         <ScrollToBottom   className="messages">
        {messages && messages.map(msg =>  <ChatMessage  key={`${msg}`} const kegf = {console.log(msg)} id={id}  messages={msg} ></ChatMessage>)}
      </ScrollToBottom>
     
       
    )

}

export default(ListMessage)