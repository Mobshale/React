import react from "react";
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import "./teacherleft.css"




function WaitingRoom(props) {


    const GoToHome = () => {
        console.log("Helmk")
        props.history.push("/");
    }
    
    return(
        <div class="center-div">
             <Result
        title="Please wait until the proctor to start the session.
          Once the session start you will be redirected"
        extra={
          <Button  onClick={() => GoToHome()}   type="primary" key="console">
            Go Back
          </Button>
        }
      />
        </div>
       
    )
}

export default WaitingRoom;