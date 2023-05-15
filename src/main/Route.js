import React from "react";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Student from "../student/Student";
import Teacher from "../teacher/teacher";
import Main from "./main";
import { Button, Result } from "antd";
import SessionDetails from "./Session";
import NotFoundError from "./NotFoundError";
import ClassEnded from "./ClassEnded";
import WaitingRoom from "./WaitingRoom";
import TeacherLeft from "./TeacherLeft";
import RedirectStudent from "./RedirectStudent";
import StudentLogin from "./StudentLogin";
import OnetoOneStudent from "../student/OnetooneStudent";
import OnetoOneTeacher from "../teacher/OnetooneTeacher";
import Landingpage from "./Landing/Landingpage";

function LoginLayout(props) {
  const history = useHistory();

  return (
    <div>
      <Switch>
        <Route exact path="/Session" component={SessionDetails}></Route>
        <Route exact path="/" component={Landingpage}></Route>
        <Route
          exact
          path="/sishya/:roomName/:userName/:cdoc/:sdoc"
          component={Student}
        />
        <Route
          exact
          path="/sishya/one2one/:roomName/:userName/:cdoc/:sdoc"
          component={OnetoOneStudent}
        />
        <Route
          exact
          path="/guru/:roomName/:userName/:cdoc/:sdoc"
          component={Teacher}
        />
        <Route
          exact
          path="/guru/one2one/:roomName/:userName/:cdoc/:sdoc"
          component={OnetoOneTeacher}
        />
        <Route
          exact
          path="/Redirect/:roomName/:type"
          component={RedirectStudent}
        ></Route>
        <Route exact path="/StudentLogin" component={StudentLogin} />
        <Route exact path="/ClassEnded" component={ClassEnded} />
        <Route exact path="/WaitingRoom" component={WaitingRoom} />
        <Route exact path="/TeacherLeft" component={TeacherLeft} />
        <Route exact path="/Login" component={Main} />
        <Route path="*" component={NotFoundError} />
      </Switch>
    </div>
  );
}
export default LoginLayout;
