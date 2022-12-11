import react from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import "./teacherleft.css";
import { useHistory } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  get,
  child,
  update,
} from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

function TeacherLeft(props) {
  const roomName = props.location.state.roomName;

  const GoToHome = () => {
    console.log("Helmk");
    props.history.push("/");
  };

  const GotoClass = () => {
    props.history.push(
      "/sishya/" + roomName + "/" + auth.currentUser.displayName + "/sdoc/cdoc"
    );
  };

  const isliveRef = ref(db, "/islive/" + roomName + "/islive");
  onValue(isliveRef, (snapshot) => {
    if (snapshot.val() == 1) {
      GotoClass();
    }
  });

  return (
    <div className="center-div">
      <Result
        status="warning"
        title="The teacher has left the session, please wait until the teacher rejoin"
        extra={
          <Button onClick={() => GoToHome()} type="primary" key="console">
            Go Console
          </Button>
        }
      />
    </div>
  );
}

export default TeacherLeft;
