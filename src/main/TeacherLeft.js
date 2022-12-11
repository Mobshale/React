import react from "react";
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import './teacherleft.css'




function TeacherLeft(props) {


    const GoToHome = () => {
        console.log("Helmk")
        props.history.push("/");
    }
    
    return(
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
       
    )
}

export default TeacherLeft;