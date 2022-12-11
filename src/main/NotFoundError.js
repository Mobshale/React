import react from "react";
import { Button, Result } from 'antd';
import "./teacherleft.css"





function NotFoundError(props) {


    const GoToHome = () => {
        console.log("Helmk")
        props.history.push("/");
    }
    
    return(
        <div class="center-div">
            <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button  onClick={() => GoToHome()}   type="primary">Back Home</Button>}
            />
        </div>
    )
}

export default NotFoundError;