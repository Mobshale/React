
import React, { Component } from 'react';
import './message.css';


const ChatMessage = (props) => {
  const {text, uid,uname} = props.messages;
  const id = props.id;
  const per = props.per;
  
  
  const messageClass = uid === "1" ? true : false;
  console.log(messageClass);


  const thedorn = () =>{
    return(
      per? (
      <div>
          <div class="msg-info-name">{uname}</div>
      </div>) 
      : 
      (<div>

      </div>)
    )
  }


  return(
    messageClass
    ? (
  
      // <div className="messageContainer justifyEnd">

      <div class="msg right-msg"> 
          <div class="msg-bubble">
             {/* <div class="msg-info">
              <div class="msg-info-name">{uname}</div>
            </div>  */}

                <div class="msg-text">
                  {text}
                </div>
            </div>
          </div>
           


      //  {/* <div className="messageBox  backgroundBlue">
   // <p className="messageText colorWhite">{text}</p>
   //     </div> */}
      // </div>
      )
      : (
        <div>
        {thedorn()}
              <div class="msg left-msg">
                <div class="msg-bubble">

                  <div class="msg-text">
                    {text}
                  </div>
                </div>
              </div>
        </div>
      
      // <div className="messageContainer justifyStart">
        //   <p>{uname}</p>
        //   <div className="messageBox backgroundLight">
        //     <p className="messageText colorDark">{text}</p>
        //   </div>
        // </div> 
      )
);

  //   /
  // )

}

export default ChatMessage;