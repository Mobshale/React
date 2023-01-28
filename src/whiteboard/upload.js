import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
// import reqwest from 'reqwest';
import "./upload.css";
import { getDatabase, ref, push, set, onDisconnect } from "firebase/database";

const d = new Date();
const date = ("0" + d.getDate()).slice(-2);
const month = ("0" + (d.getMonth() + 1)).slice(-2);
const time = `${date}${month}${d.getFullYear()}`;

var uploadURI = "https://upload.mobshale.com:8080/uploadppt";
// var uploadURI = 'https://54.173.234.24:8080/uploadppt';

var roomName;

class Uploadppt extends React.Component {
  constructor(props) {
    super(props);
    roomName = props.roomName;

    this.state = {
      fileList: [],
      uploading: false,
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("ppt", file);
    });

    this.setState({
      uploading: true,
    });

    axios
      .post(uploadURI, formData)
      .then((response) => {
        this.setState({
          uploading: false,
          fileList: [],
        });

        if (response.status === 200) {
          console.log(response.data);
          var ppts = response.data;
          const db = getDatabase();
          const postListRef = ref(db, time + "ppt/" + roomName);
          set(postListRef, ppts);
          onDisconnect(postListRef).remove();
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          console.log(newFileList);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div class="upload">
        <Upload {...props}>
          <Button disabled={fileList.length === 1} icon={<UploadOutlined />}>
            Select ppt
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginLeft: "10px" }}
        >
          {uploading ? "Uploading" : "Upload"}
        </Button>
      </div>
    );
  }
}

export default Uploadppt;
