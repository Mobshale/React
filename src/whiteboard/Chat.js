import React, { Component } from 'react';
import "./chat.css"
import { Button} from "antd";
import { Form, Input, Space } from 'antd';
import ListMessage from "./ListMessages";
import { getDatabase, ref, push, set ,onDisconnect } from "firebase/database";
import {  onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
import MembersList from './Members';




const { Search } = Input;
var messages = [];
var userName;
var roomName;
var names = [];


class Chat extends React.Component {
 
  constructor(props){
    super(props)
    userName = props.userName;
    roomName = props.roomName;


    
    this.state = {
      ChatUpdate : "no",
      isChat: true
    }

    const db = getDatabase();

    const postListRef = ref(db, 'members/'+roomName);
      const newPostRef = push(postListRef);
      set(newPostRef, {
        uname: userName
      });

      onDisconnect(newPostRef).remove();

   
  }

  componentDidMount(){
    const db = getDatabase();
    const chatRef = ref(db, 'chats/' + roomName);
    onChildAdded(chatRef, (data) => {
      console.log(userName);
      if(data.val().uname!=userName){
        console.log(data.val());
        messages.push(data.val());
        this.setState({
          ChatUpdate: "update"
        })
      }

    });


    const memRef = ref(db, 'members/' + roomName);
    onChildAdded(memRef, (data) => {
      names.push(data.val().uname);
      this.setState({
        ChatUpdate: "update"
      })

    });

    onChildRemoved(memRef, (data) => {
      removeItemOnce(names,data.val().uname);
      this.setState({
        ChatUpdate: "update"
      })
    });


      


  }

  cha = () => {
    this.setState({isChat: true})
  }

  chga = () => {
    this.setState({isChat: false})
  }

 
  
  send = () =>{
    const value = document.getElementById('text').value;
    
    console.log(value);

    if(value!=""){
      const data = {
        text: value ,
        uid: "1",
        uname: userName

      }
      messages.push(data);
      document.getElementById('text').value = "";
      const db = getDatabase();
      const postListRef = ref(db, 'chats/'+roomName);
      const newPostRef = push(postListRef);
      set(newPostRef, {
        text: value ,
        uid: "2",
        uname: userName

      });
      this.setState({
        ChatUpdate: "update"
      })
    }
 
   
   }

  render(){

    

   
    
  return (
   <div class="chat">
      <div class="chatbar">
           <Button class="chatbtn" onClick={this.cha} block>Chat</Button>
           <Button class="membtn" onClick={this.chga} block >Members</Button>
       </div>
       
       {this.state.isChat ? (
         <ListMessage   messages={messages}  id={"1"}></ListMessage>
         ) : (
          <MembersList names={names} ></MembersList>
        )} 

        {this.state.isChat ? (
           <div class='textbox'>

            <div className="form">
                <input id={'text'}
                className="input"
                type="text"
                style={{width:"280px", height:"100%"}}
                placeholder="Type a message..."
                onKeyPress={(event) => event.key === 'Enter' ?  this.send() : null}
                  ></input>
                  <button className="sendButton" onClick={this.send}>Send</button>

                {/* <Button type="primary" class="send" onClick={this.send} style= {{height:"100%"}}>Send</Button> */}
              </div>
            
            </div>
         ) : (
           <div></div>
        )}      
      
   </div>

  );
  }
  
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export default Chat;
