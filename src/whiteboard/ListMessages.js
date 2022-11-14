
import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import ScrollToBottom from 'react-scroll-to-bottom';
import './ListMessage.css'


const ListMessage = (props) => {
    const messages = props.messages;
    const id = props.id;
    var prev = null;

    const checkprev = (msg) =>{
      if(prev == null || prev != msg.uname){
        prev = msg.uname
        return true

      }else{
        return false
      }

    }

    return(
    
         <ScrollToBottom   className="messages">
        {messages && messages.map(msg =>  <ChatMessage  key={`${msg}`} const kegf = {console.log(msg)} id={id} 
         messages={msg} 
         per= {checkprev(msg)}
        
        
        ></ChatMessage>)}
      </ScrollToBottom>
     
       
    )

}

export default(ListMessage)