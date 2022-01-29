import React from "react";
import {useState,useEffect} from "react";

import SquareLoader from  "../../components/SquareLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import user from "../../img/user.svg";

function UserProfile() {

   const [loading,setLoading]=useState(true);

   const [name,setName]=useState("");
   const [old_password,setOldPassword]=useState("");
   const [new_password,setNewPassword]=useState("");

   useEffect(()=>{
      if(!name){
        getProfile();
      }
   },[])

   const handleClick=()=> {
    if(name && old_password){
        setLoading(true)
        API.updateMyProfile({name,old_password,new_password})
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
        errorHandler(true,"Plse give old password to update your account");
    }
   }

   const getProfile=()=>{
    let res= API.getMyProfile()
    .then((res)=>{
      setLoading(false);
      if(res.data.status==="sucess"){
        setName(res.data.name);
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
  

  return ( <>
          <SquareLoader  loading={loading}/>
          <div className="profile_container">
              <div className="form_container">
                  <div className="form_input">
                    <label for="name"> Name <span className="red_color">*</span></label>
                    <input type="text" name="name" required={true} onChange={(e)=>{setName(e.target.value);}} value={name}/>
                  </div>

                  <div className="form_input">
                    <label for="old_password"> Old Password<span className="red_color">*</span> </label>
                    <input type="old_password" name="old_password" placeholder="Old password" required="true" onChange={(e)=>{setOldPassword(e.target.value);}} value={old_password} />
                  </div>

                  <div className="form_input">
                    <label for="new_password"> New Password </label>
                    <input type="new_password" name="new_password" placeholder="New password" onChange={(e)=>{setNewPassword(e.target.value);}} value={new_password} />
                  </div>
                  <div className="form_button">
                      <input type="submit" name="update" value="Update My Account" className="update" onClick={handleClick}/>
                  </div>
              </div>
          </div>
          </>);

}

export default UserProfile;