
import React, { Component } from 'react';
import { Pagination, Tooltip } from 'antd';
import "./pag.css"
import { PlusSquareFilled, PlusSquareTwoTone   } from '@ant-design/icons';
import { MContext } from './MyProvider';

var page=10,
current=1;



class Pag extends React.Component {

  constructor(props){
    super(props)


    this.state = { 
      page: 10,
     };
  
  }

  
  imageClick = (v,context) => {
    // context.setMessage(v);
    page=page+10;
    current=page/10;
    this.setState({
      page:this.page+10
    })
    
  } 

  onChange = (page,context) => {
    context.setMessage(page);
    
  } 


  render(){
  
  return (
    <MContext.Consumer>
        {(context) => (
          <div class="pag">
          <Tooltip placement="top" title={<span>Add Page</span>}>
                <PlusSquareTwoTone class="addpage"  twoToneColor="#eb2f96" style={{cursor:"pointer" , marginLeft:"5px", fontSize:'25px'}} onClick={this.imageClick.bind(this,"new",context)}  />
                </Tooltip>
              
                <Pagination simple   onChange={ val => this.onChange(val,context)} total={page} />
          
           
        </div>
        )}
      </MContext.Consumer>
   

  );
  }
  
}

export default Pag;
