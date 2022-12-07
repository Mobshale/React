import React from 'react';
import { useHistory } from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    
  } from "react-router-dom";
import Student from '../student/Student';
import Teacher from '../teacher/teacher';
import Main from './main';
import SessionDetails from './Session';


function LoginLayout() {
  const history = useHistory();
  
  return (
    <div>
    <Switch>
    <Route exact path="/Session" component={SessionDetails}></Route>
    <Route exact path="/sishya/:roomName/:userName/:cdoc/:sdoc" component={Student} />
    <Route exact path="/guru/:roomName/:userName/:cdoc/:sdoc" component={Teacher} />
    <Route exact path="/" component={Main} />
    <Route path="*" component={() => ( <div style={{display: 'flex', flexdirection:'row', justifyContent:'center', alignItems:'center', height: '100vh'}}>404 not found Shisya </div>)}/>
    </Switch>

  </div>



  );
}
export default LoginLayout;