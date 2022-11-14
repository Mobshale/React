import React, { Component } from 'react';
import "./chat.css"
import { Button} from "antd";
import { Form, Input, Space } from 'antd';
import ListMessage from "./ListMessages";
import { getDatabase, ref, push, set ,onDisconnect } from "firebase/database";
import {  onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
import MembersList from './Members';
import { Segmented  } from 'antd';
import 'antd/dist/antd.css';
import { FormInstance } from 'antd/lib/form';




const { Search } = Input;
var messages = [];
var userName;
var roomName;
var names = [];
var inutValue =""





class Chat extends React.Component {
 


  constructor(props){
    super(props)
    userName = props.userName;
    roomName = props.roomName;


    this.formRef = React.createRef();

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
      if(!names.includes(data.val().uname)){
        names.push(data.val().uname);
      }
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

  cha = (str) => {
    console.log(str)
    switch(str){
      case "Chat":
        this.setState({isChat: true})
        break;
      case "Members":
        this.setState({isChat: false})
        break;
    }
   
  }

  

 
  
  send = () =>{

    const value=  document.getElementById('text').value;
    console.log(this.formRef.current.resetFields());


    console.log(value);

    if(value!=""){
      const data = {
        text: value ,
        uid: "1",
        uname: userName

      }
      messages.push(data);
      // form.resetFields();

      console.log("resetting")
      
      // document.getElementById('text').value = " jkih";
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
      
        <Segmented block  options={["Chat", "Members"]} onChange={str=> this.cha(str) }></Segmented>
        
           {/* <Button class="chatbtn" onClick={this.cha} block>Chat</Button>
           <Button class="membtn" onClick={this.chga} block >Members</Button> */}
       </div>
       
       <div class="listofdata">
          {this.state.isChat ? (
            <ListMessage   messages={messages}  id={"1"}></ListMessage>
            ) : (
              <MembersList names={names} ></MembersList>
            )} 
       </div>
       
          <div class="txting">
                  {this.state.isChat ? (
              <div class='textbox'>

              
                <Form  ref={this.formRef}>
                        <Form.Item name="textField"  rules={[{ required: true }]}>
                        <Input.Group compact>
                      <Input id='text' style={{  width: 'calc(100% - 80px)' }} onPressEnter={this.send} />
                      <Button  onClick={this.send} style={{width:"80px"}} type="primary">Send</Button>
                        </Input.Group>
                        </Form.Item>
                </Form>
                
                </div>
                  ) : (
                    <div></div>
                  )}      
           </div>

          
      
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
