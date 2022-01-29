import React from "react";
import {useState} from "react";
import {useHistory } from "react-router-dom";

import SquareLoader from  "../../components/SquareLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

function Signup() {
   const [name,setName]=useState("");
   const [email,setEmail]=useState("");

   const [password,setPassword]=useState("");
   const [loading,setLoading]=useState("");

   const history = useHistory();


   function validate(){
      if(name &&  email && password){
        return true
      }
      return false;
   }

   function siginUp(){
     if(validate()){
       setLoading(true);
       API.signUp({name,email,password})
       .then((res)=>{
              setLoading(false);
             if(res.data.status==="sucess"){
                errorHandler(false,"Plse check your email and verify it to add the question.");
                history.push("/signin");  
             }
             else{
                errorHandler(true,res.data.msg);

             }
       })
       .catch((res)=>{
          setLoading(false);
          if(res.data && res.data.msg){
            errorHandler(true,res.data.msg);

          }else{
            errorHandler(true,"Something went wrong");
          }
    });
     }else{
        errorHandler(true,"Fill all detail");
     }
  }

return ( <>
    <SquareLoader  loading={loading}/>  
    <div className="signup_wrapper">
     <div className="signup_container">
        <div className="form_container">
            <div className="form_input">
              <label for="name"> Name </label>
              <input type="text" name="name" required={true}  onChange={(e)=>{setName(e.target.value);}} value={name}/>
            </div>

            <div className="form_input">
              <label for="email"> Email </label>
                <input name="email" required={true} type="email" onChange={(e)=>{setEmail(e.target.value);}} value={email} />
            </div>

            <div className="form_input">
            <label for="password"> Password </label>
            <input type="password" name="password" required={true} onChange={(e)=>{setPassword(e.target.value);}} value={password} />
            </div>

            <div className="form_button">
            <input type="submit" name="login" value="Sign Up" className="signup" onClick={siginUp}/>
            </div>
             <div className="form_text">
               <small> Already have account? <a href="/signin"> Signin </a></small>
            </div>
        </div>
     </div>
    </div>
    </>);

}
export default Signup;