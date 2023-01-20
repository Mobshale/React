import react from "react";
import "./teacherleft.css";
import { useHistory } from "react-router-dom";

function RedirectStudent(props) {
  const { roomName } = props.match.params;
  const { type } = props.match.params;

  console.log(roomName);
  const history = useHistory();
  history.push({
    pathname: "/StudentLogin",
    state: {
      roomname: roomName,
      sessiontype: type,
    },
  });

  return <h1 class="center-div">Redirecting ...</h1>;
}

export default RedirectStudent;
