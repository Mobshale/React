import React from "react";
import { MContext } from './MyProvider';
import 'antd/dist/antd.css';
import './polls.css';
import { Button, Popover, message } from 'antd';
import { Alert } from 'antd';
import {initializeApp} from 'firebase/app';
import { firebaseConfig } from "../main/firebaseCon";
import { getDatabase, ref, set, get ,update , push, remove, child } from "firebase/database";

var btntxt ="Send poll";
const app = initializeApp(firebaseConfig);
const FirebaseDatabase = getDatabase(app);
const key = 'updatable';

var roomN;



class Polls extends React.Component{

    constructor(props){
        super(props)
        roomN = props.roomName;
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
            dis3: false,
            seconds: null,
            polltype: null,
            ans: null

          };


    }

    

    btn1(){
        this.setState({ btn1type: "primary",
        btn2type: "default",
        btn3type: "default",
        btn4type: "default",
        btn5type: "default",
        seconds:  10,
     });
    }
    btn2(){
        this.setState({ btn1type: "default",
        btn2type: "primary",
        btn3type: "default",
        btn4type: "default",
        btn5type: "default",
        seconds:  15,


    
    });
    }
    btn3(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "primary",
        btn4type: "default",
        btn5type: "default",
        seconds:  20,


    
    });
    }
    btn4(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "default",
        btn4type: "primary",
        btn5type: "default",
        seconds:  25,

    });
    }
    btn5(){
        this.setState({ btn1type: "default",
        btn2type: "default",
        btn3type: "default",
        btn4type: "default",
        btn5type: "primary",
        seconds:  30,

        });
    }

    btn6(){
        this.setState({ poll1type: "primary",
        poll2type: "default",
        poll3type: "default",
        dis1: true,
        dis2: true,
        polltype:1
     });
    }
    
    btn7(){
        this.setState({ poll1type: "default",
        poll2type: "primary",
        poll3type: "default",
        dis1: true,
        dis2: true,
        polltype:2 
    });
    }
    btn8(){
        this.setState({ poll1type: "default",
        poll2type: "default",
        poll3type: "primary",
        dis1: false,
        dis2: false,
        polltype:3
     });
    }
    btn9(){
        this.setState({ optionA: "primary",
        optionB: "default",
        optionC: "default",
        optionD: "default",
        ans:1
         });
    }

    btn10(){
        this.setState({ optionA: "default",
        optionB: "primary",
        optionC: "default",
        optionD: "default",
        ans:2
     });
    }

    btn11(){
        this.setState({ optionA: "default",
        optionB: "default",
        optionC: "primary",
        optionD: "default",
        ans:3
     });
    }
    btn12(){
        this.setState({ optionA: "default",
        optionB: "default",
        optionC: "default",
        optionD: "primary",
        ans:4
     });
    }
    submit = ( context ) => {
        context.setMessage("pollprogress")

        console.log("submitted");
        if(this.state.seconds != null && this.state.ans !== null && this.state.polltype != null){
            
            const PollRef = ref(FirebaseDatabase, "poll/"+roomN+"/pes") ;
            const resultRef = ref(FirebaseDatabase,"poll/"+roomN+"/hits");
            message.loading({ content: 'Sending Polls...', key });
            setTimeout(() => {
              message.success({ content: 'Poll sent succesful!', key, duration: 2 });
            }, 1000);

            set(PollRef,{
                seconds: this.state.seconds,
                ans: this.state.ans,
                polltype: this.state.polltype
            })

            set(resultRef,{
                a:0,
                b:0,
                c:0,
                d:0,
                t:0,
                s:this.state.seconds 
        
            })

            
            
            setTimeout(() => {
                context.setMessage("pollprogressend")
                remove(PollRef)
                remove(resultRef)
            }, (this.state.seconds*1000)+1000);
            
            this.setState({
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
                seconds: null,
                ans: null,
                polltype : null,

            })

        } else{
            message.warning("Please select the polls option properly");
           

        }
        
        

    }



    

    render(){

        const content = (

            <MContext.Consumer>
                 {(context) => (
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
                     <Button type="primary" disabled={this.state.dis3} onClick={() => this.submit(context) } block>{btntxt}</Button>
                     </div>
                 </div>

                 )}

            </MContext.Consumer>

           
          );
        

        return(
            <MContext.Consumer>
            {(context) => (

                <div>
                    <div class="polls">
                    <Popover content={content} title="Start a poll" trigger="hover">
                    <Button>Polls</Button>
                    </Popover>
                   </div>

                   {/* <div class="alert">
                   {
                   this.state.perfect? null  : <Alert  type="warning" showIcon closable message={this.state.msg}></Alert>
                   }
                    {
                   this.state.success? <Alert  type="success" showIcon closable message={this.state.msg} ></Alert>   : null
                   }
                   </div> */}

                </div>
                
                


            )}
           
          


            </MContext.Consumer>
        )
        
    }
} 

export default Polls