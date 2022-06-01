
import React, { Component } from 'react';
import { Table,Pagination, Tooltip } from 'antd';
import "./pag.css"
import { PlusSquareFilled, PlusSquareTwoTone   } from '@ant-design/icons';
import { MContext } from './MyProvider';
import bac from './image/bac.svg';
import far from './image/for.svg';

var page=150,
current=1,
con = null;



class Pag extends React.Component {

  constructor(props){
    super(props)


    this.state = { 
      page: 10,
      cpage: 1,
      total :15,
      pagination: null,
      cont: null
     };


     
    
  }

 
  componentDidMount(){
    var pagg = document.getElementsByClassName("pagg");
 
     
    document.onkeydown = function (event) {
      switch (event.keyCode) {
         case 37:
            console.log("Left key is pressed.");
              var hangoutButton = document.getElementById("leftbtn");
              hangoutButton.click(); // this will trigger the click event
            
            break;
         case 38:
            console.log("Up key is pressed.");
            break;
         case 39:
            console.log("Right key is pressed.");
            // console.log(pagg.onChange(current+1,pagg.pageSize))
            var hangoutButton = document.getElementById("rightbtn");
            hangoutButton.click();
              
            

            break;
         case 40:
            console.log("Down key is pressed.");
            break;
      }
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

  right = (context) => {
    if(this.state.cpage==this.state.total){
      context.setMessage(this.state.cpage+1);
      this.setState({
        cpage:this.state.cpage+1,
        total: this.state.total+1
      })
      
    }else{
      context.setMessage(this.state.cpage+1);
      this.setState({
        cpage:this.state.cpage+1
      })
      
    }
   
  }

  left =(context) => {
    if(this.state.cpage!=1){
      context.setMessage(this.state.cpage-1);
      this.setState({
        cpage:this.state.cpage-1
      })
      
    }
    
  }


  render(){
  
  return (
    <MContext.Consumer>
        {(context) => (
          

          
          <div class="pag">
          
         
              
                <Tooltip placement="top" title={<span>Previous</span>}>
                <img id="leftbtn" width={20} height={20} src={bac}  onClick={()  => this.left(context)} alt="selector"></img></Tooltip>

                <text>  &nbsp;&nbsp;&nbsp;&nbsp;</text>
                <text id="curent">  {this.state.cpage}</text>
                <text >   &nbsp;&nbsp; / &nbsp;&nbsp;</text>
                <text id="total">  {this.state.total}</text>
                <text >  &nbsp;&nbsp;&nbsp;&nbsp; </text>



                <Tooltip placement="top"  title={<span>Next</span>}>
                <img id="rightbtn" width={20} height={20} src={far}  onClick={() => this.right(context)}  alt="selector"></img></Tooltip>
                
           
        </div>
        )}
      </MContext.Consumer>
   

  );
  }
  
}

export default Pag; 
