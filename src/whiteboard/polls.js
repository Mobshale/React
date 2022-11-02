import React from "react";
import { MContext } from './MyProvider';
import 'antd/dist/antd.css';
import './polls.css';

import { Button, Popover } from 'antd';


var btntxt ="Send poll";
class Polls extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            btn1type: "default",
            btn2type: "default",
            btn3type: "default",
            btn4type: "default",
            btn5type: "default",
            poll1type: "default",
            poll2type: "default",
            poll3type: "default",
            optionA: "default",
            optionB: "default",
            optionC: "default",
            optionD: "default",
            dis1: false,
            dis2: false,
            dis3: false

          };
    }

    btn1(){
        this.setState({ btn1type: "primary",
        btn2type: "default",
        btn3type: "default",
        btn4type: "default",
        btn5type: "default", });
    }
    btn2(){
        this.setState({ btn1type: "default",
        btn2type: "primary",
        btn3type: "default",
        btn4type: "default",
        btn5type: "default", });
    }
    btn3(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "primary",
        btn4type: "default",
        btn5type: "default", });
    }
    btn4(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "default",
        btn4type: "primary",
        btn5type: "default", });
    }
    btn5(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "default",
        btn4type: "default",
        btn5type: "primary", });
    }

    btn6(){
        this.setState({ poll1type: "primary",
        poll2type: "default",
        poll3type: "default",
        dis1: true,
        dis2: true });
    }
    
    btn7(){
        this.setState({ poll1type: "default",
        poll2type: "primary",
        poll3type: "default",
        dis1: true,
        dis2: true });
    }
    btn8(){
        this.setState({ poll1type: "default",
        poll2type: "default",
        poll3type: "primary",
        dis1: false,
        dis2: false });
    }
    btn9(){
        this.setState({ optionA: "primary",
        optionB: "default",
        optionC: "default",
        optionD: "default",
         });
    }

    btn10(){
        this.setState({ optionA: "default",
        optionB: "primary",
        optionC: "default",
        optionD: "default" });
    }

    btn11(){
        this.setState({ optionA: "default",
        optionB: "default",
        optionC: "primary",
        optionD: "default" });
    }
    btn12(){
        this.setState({ optionA: "default",
        optionB: "default",
        optionC: "default",
        optionD: "primary" });
    }
    submit(){
        btntxt = "Sent"
        this.setState({ dis3: true });
    }



    

    render(){

        const content = (
            <div >
                <div class="sec">
                    <Button type={this.state.btn1type}  onClick={() => this.btn1()} shape="circle">
                        10s
                    </Button>
                    <Button type={this.state.btn2type} onClick={() => this.btn2()} shape="circle">
                        15s
                    </Button>
                    <Button type={this.state.btn3type}  onClick={() => this.btn3()} shape="circle">
                        20s
                    </Button>
                    <Button type={this.state.btn4type}  onClick={() => this.btn4()} shape="circle">
                        25s
                    </Button>
                    <Button type={this.state.btn5type}  onClick={() => this.btn5()} shape="circle">
                        30s
                    </Button>
                </div>
                <br/>
              <div class="sec">
                    <Button type={this.state.poll1type}  onClick={() => this.btn6()}>Yes/No</Button>
                    <Button type={this.state.poll2type}  onClick={() => this.btn7()}>A/B</Button>
                    <Button type={this.state.poll3type}  onClick={() => this.btn8()}>A/B/C/D</Button>
              </div>
              <br/>
              <div class="sec">
                    <Button type={this.state.optionA}  onClick={() => this.btn9()}>A</Button>
                    <Button type={this.state.optionB}  onClick={() => this.btn10()}>B</Button>
                    <Button type={this.state.optionC}  disabled={this.state.dis1}  onClick={() => this.btn11()}>C</Button>
                    <Button type={this.state.optionD}  disabled={this.state.dis2} onClick={() => this.btn12()}>D</Button>

              </div>
              <br/>
                <div>
                <Button type="primary" disabled={this.state.dis3} onClick={() => this.submit() } block>{btntxt}</Button>
                </div>
            </div>
          );
        

        return(
            <MContext.Consumer>
            {(context) => (
                
                <div class="polls">
                    <Popover content={content} title="Start a poll" trigger="hover">
                    <Button>Polls</Button>
                    </Popover>


                </div>
            )}


            </MContext.Consumer>
        )
        
    }
} 

export default Polls