
import React, { Component } from 'react';
import ListUsers from './ListUsers';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Members.css'


const MemberList = (props) => {
    const names = props.names;


    return(
        <ScrollToBottom   className="messages">
        {names && names.map(name =>  <ListUsers  key={`${name}`}  name={name}   ></ListUsers>)}
      </ScrollToBottom>
    )

}

export default(MemberList)