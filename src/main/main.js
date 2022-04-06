import React, { Component } from 'react';
import './main.css'
import tech from '../svg/tech.svg'
import know from '../svg/know.svg'
import logo from '../svg/logo.png'
import QRCode from 'qrcode'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "../main/firebaseCon";
import { getDatabase, ref, set,onValue,push, remove, get, child } from "firebase/database";
import { Redirect } from "react-router-dom";


var qrcode;
var fcode;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


class Main extends React.Component {
 
  constructor(props){
    super(props)
    

    this.state = { redirect: null };

   
  }


  componentDidMount(){
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFF";
    ctx.fillRect(0, 0, 500, 500);
    qrcode  =  makeid(120)
    QRCode.toCanvas(canvas, qrcode, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
    fcode = qrcode.slice(0,15);
    
    const d = new Date();
    var date = ""+d.getDate();
    if (date.length === 1) {
      date= "0"+date;
    }
    var month = ""+(d.getMonth()+1);
    if (month.length === 1) {
      month= "0"+month;
    }
    var time = ""+ date+month+d.getFullYear();
    console.log(date);

    set(ref(db, '/' +time+'/'+fcode), {
      t: 0
      
    });


    const postListRef = ref(db,  '/' + time+'/'+fcode);
    // console.log(postListRef);
    onValue(postListRef, (snapshot) => {
        var kt = snapshot.val();
        if(kt.t===1){
          this.setState({ redirect: "/guru/"+kt.c+"/"+kt.n+"/"+kt.cdoc+"/"+kt.sdoc });
        }else if(kt.t === 2){
          this.setState({ redirect: "/sishya/"+kt.c+"/"+kt.n+"/"+kt.cdoc+"/"+kt.sdoc});

        }
    });

    
  }
  
 
 
   


  render(){

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    
  return (
   <div class="body" >



    
    
    <img class="logo" src={logo}>
       </img>
 
      

       <div class="center">

          <div class="white_bac">
            <h1 class="t1">Welcome Back!</h1>
            <h4 class='t2'>We're so excited to see you again</h4>

            <br></br>
            <br></br>
            <br></br>
            
            <h2 class='t3'>
              You're just one step closer to join the class.
              Scan the code to enter the class. Happy class!
            </h2>

          </div>
          
           <div class="white_bac2">
             <div>
             <canvas id="canvas" style={{width:'360px', height:'300px'}}></canvas>
             </div>
           <h2 class="t1">Login in with QR Code</h2>
           <p class='t2'>Scan this with the <strong>Mobshale mobile app</strong> to join instantly.</p>
           </div>

        

           
       </div>

       <img class="teach" src={tech}>
       </img>

       <img class='know' src={know}></img>
       
      
   </div>

  );
  }





}

function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
    }
    return result;
}



export default Main;
