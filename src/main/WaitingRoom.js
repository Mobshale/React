import react from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import "./teacherleft.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../main/firebaseCon";
import { getAuth } from "firebase/auth";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

function WaitingRoom(props) {
  const roomName = props.location.state.roomName;

  const GoToHome = () => {
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
    <div class="center-div">
      <Result
        title="Please wait until the proctor to start the session.
          Once the session start you will be redirected"
        extra={
          <Button onClick={() => GoToHome()} type="primary" key="console">
            Go Back
          </Button>
        }
      />
    </div>
  );
}

export default WaitingRoom;
