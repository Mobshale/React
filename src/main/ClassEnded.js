import react from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import "./teacherleft.css";

function ClassEnded(props) {
  const GoToHome = () => {
    console.log("Helmk");
    props.history.push("/");
  };

  return (
    <div class="center-div">
      <Result
        icon={<SmileOutlined />}
        title="Great, The session has ended, see you again!"
        extra={
          <Button onClick={() => GoToHome()} type="primary">
            Back to Home
          </Button>
        }
      />
    </div>
  );
}

export default ClassEnded;
