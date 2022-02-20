import React from "react";
import {useState} from "react";
import {useHistory } from "react-router-dom";


import SquareLoader from "../../components/SquareLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import user from "../../img/user.png";
import "./style.css";


function Signin({setUser}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState("");

  const history = useHistory();

  function validate(){
      if(email && password){
        return true
      }
      return false;
   }
  function HandleForm(){
     if(validate()){
          setLoading(true);
          let res=  API.signIn({email,password})
          .then((res)=>{
            setLoading(false);
            if(res.data.status==="sucess"){
              API.setToken(res.data.token);
              API.setAuthHeader();
              setUser(true);
              history.push("/user/myQuestions");
            }
            else{
                errorHandler(true,res.data.msg);
            }
          })
          .catch((res)=>{
              setLoading(false);
              res=res.response
              if(res.data && res.data.msg){
                errorHandler(true,res.data.msg);
              }else{
                errorHandler(true,"Something went wrong");
              }
          });
      }
      else{
          errorHandler(true,"Fill all detail");
      }
  };

  return ( 
    <>
    <SquareLoader  loading={loading}/>
    <div className="user">
      <p>Welcome Back</p>
    </div>  
    <div className="signin_container">
      <div className="form_container">

          <div className="form_input">
            <label for="name"> Email </label>
            <input type="email" placeholder="Email..." name="email" required={true} onChange={(e)=>{setEmail(e.target.value);}} value={email}/>
          </div>

          <div className="form_input">
            <label for="password"> Password </label>
            <input type="password" placeholder="Password..." name="password" required={true} onChange={(e)=>{setPassword(e.target.value);}}value={password} />
          </div>

          <div className="form_button">
             <input type="submit" name="signin" value="SIgn In" className="signin_button" onClick={HandleForm}  />
          </div>

          <div className="form_text">
              <small>
              <a href="/user/forgetPassword"> Forget password ? </a></small>
              <small> New to Discussy ? <a href="/signup"> Create an account </a></small>
          </div>
   
      </div>
    </div>
    </>);

  }

export default Signin;
