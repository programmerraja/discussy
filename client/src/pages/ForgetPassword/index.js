import React from "react";
import {useState} from "react";

import SquareLoader from "../../components/SquareLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";


import forget from "../../img/forget.svg";

import "./style.css";

function ForgetPassword(){
    
  const[loading,setLoading]=useState(false) 
  const [email,setEmail]=useState("");

  function sendForgetPassword(){
    if(email){ 
        setLoading(true);
        API.sendForgetPassword(email)
        .then((res)=>{
              setLoading(false);
              if(res.data.status==="sucess"){
                errorHandler(false,res.data.msg);
              }else{
                  errorHandler(true,res.data.msg);
              }
        })
        .catch((res)=>{
          setLoading(false);
          if(res.data && res.data.msg){
            errorHandler(true,res.data.msg);
          }else{
            errorHandler(true);
          }
        });
    }
    else{
        errorHandler(true,"Please Enter The Email");
    }
  }
    
return ( 
    <>
    <SquareLoader  loading={loading}/>
    
    <div class="forget_container">
      <div class="forget_img">
        <img src={ forget } />
      </div>

      <div class="forget_text">
        <h2> Forgot Password ? </h2>
        <p> Enter the email address associated with your account.We will send link to reset the password </p>
        <input type="email" name="email" placeholder="Email Address" class="forget_email"  onChange={(e)=>{setEmail(e.target.value);}}  value={email} />
        <input type="button" name="send_link" class="send_link" value="Send Link"  onClick={sendForgetPassword}/>
      </div>
      
    </div>
    </>
);

}
export default ForgetPassword;