import React from "react";
import { Button, Card } from "antd";
import "./pollsoption.css"

class Pollsoption extends React.Component{

    constructor(props){
        super(props)
    }

    componentDidMount(){

    }


    render(){
        return(
            <div class="prag">
                <Card class="optioncard" title="Poll Option" style={{width:"100%"}}  extra={<div class="secc">
                    30s
                    </div>
                    }>
                    <div class="se">
                    <Button  type="primary" bordered="true"  style={{width:"50%", height:"100%"}}  >
                        Option A
                    </Button>
                    <Button  type="primary" bordered="true"  style={{width:"50%", height:"auto"}}  >
                        Option B
                    </Button>
                    </div>
                    
                    <br></br>
                    <div class="sem">
                    <Button disabled="true" type="primary" style={{width:"50%", height:"auto"}}  >
                        Option C
                    </Button>
                    <Button disabled="true" type="primary" style={{width:"50%", height:"auto"}}  >
                        Option D
                    </Button>
                    </div>
                    
                </Card>
            </div>
        )
    }
}

export default Pollsoption