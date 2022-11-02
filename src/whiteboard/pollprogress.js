import React,{useState} from "react";
import './pprogress.css';
import { Card } from 'antd';
import { Progress, Button, Modal, Table } from 'antd';


const dataSource = [
    {
      key: '1',
      name: 'Mike',
      option: "A",
      seconds: '10ms',
    },
    {
      key: '2',
      name: 'John',
      option: "B",
      seconds: '50s',
    },
    {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
      {
        key: '2',
        name: 'John',
        option: "B",
        seconds: '50s',
      },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Option',
      dataIndex: 'option',
      key: 'option',
    },
    {
      title: 'Seconds',
      dataIndex: 'seconds',
      key: 'seconds',
    },
  ];



class Pollprogress extends React.Component{

    
    constructor(props){
        super(props)
        this.state ={
            setopen: false,
            showMyComponent: false
           
        }
            
        
   
    }
   


    
    componentDidMount(){
       
    }


    render(){

        return(

            <div class="progress" style={this.state.showMyComponent ? {} : { display: 'none' }}>
                <Card title="Poll progress"  bordered={false} extra={<div class="secc">
                    30s
                    </div>}
                     style={{ width: 300 }}>
                <div class="sec"><p>A</p> <Progress percent={80} status="active" /></div>
                <div class="sec"><p>B</p> <Progress percent={20} status="active" /></div>
                <div class="sec"><p>C</p> <Progress percent={0} status="active" /></div>
                <div class="sec"><p>D</p> <Progress percent={0} status="active" /></div>
                <Button type="primary" onClick={() => this.setState({setopen: true})} block>Leaderboard</Button>
              
                </Card>
                <Modal
                title="Leaderboard"
                centered
                visible={this.state.setopen}
                // onOk={() => this.setState({setopen: false})}
                onCancel={() => this.setState({setopen: false})}
                width={1000}
                footer={null}
            >
                <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 50 }}  scroll={{ y: 240 }} />
                
            </Modal>
                
            </div>
            

        )
    }
    
}

export default Pollprogress