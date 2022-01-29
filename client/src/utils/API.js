import axios from "axios";
import jwt_decode from "jwt-decode";

import userService from "./userService";
import questionService from "./questionService";
import answerService from "./answerService";

export default {
  setToken:function (token) {
     localStorage.setItem("token",token);
  },
  isAuth:function(){
    let token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  },
  setAuthHeader: function () {
    let token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  },
  removeAuthHeader: function () {
    axios.defaults.headers.common["Authorization"] = "";
  },
  checkTokenExp: function () {
    let token = localStorage.getItem("token");
    //check only if token avalible and checking it is valid token 
    //if it valid token if we split according to dot the array length will greater then or =2
    if (token && token.split(".").length>=2)  {
      var decoded = jwt_decode(token);
      let currentDate = new Date();
      // JWT exp is in seconds
      if (decoded.exp * 1000 < currentDate.getTime()) {
        //removing user data from local storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return true;
      }
    }else{
      //token not valid mean it expired so true
      return true;
    }
    return false;
  },
  decodedUserJWT: function () {
    let token = localStorage.getItem("token");
    //check only if token avalible
    if (token  && token.split(".").length>=2) {
      var decoded = jwt_decode(token);
      let user = decoded;
      return user;
    }
    return null;
  },

  //user Auth
  signIn:userService.signIn,
  signUp:userService.signUp,  
  verfiyEmail:userService.verfiyEmail,
  //user profile
  getMyProfile:userService.getMyProfile,
  updateMyProfile:userService.updateMyProfile,
  
  sendForgetPassword:userService.sendForgetPassword,
  sendResetPassword:userService.sendResetPassword,
  
  logout:userService.logout,
  //user question
  getMyQuestions:userService.getMyQuestions,
  getMySortedQuestions:userService.getMySortedQuestions,
  getMyQuestion:userService.getMyQuestion,


  addMyQuestion:userService.addMyQuestion,
  updateMyQuestion:userService.updateMyQuestion,
  deleteMyQuestion:userService.deleteMyQuestion,

  //user answer
  getMyAnswers:userService.getMyAnswers,
  getMyAnswer:userService.getMyAnswer,

  addMyAnswer:userService.addMyAnswer,
  updateMyAnswer:userService.updateMyAnswer,
  deleteMyAnswer:userService.deleteMyAnswer,
  
  //question
  getQuestions:questionService.getQuestions,
  getSortedQuestions:questionService.getSortedQuestions,

  //answer
  getAnswers:answerService.getAnswers,
  getSortedAnswers:answerService.getSortedAnswers,

};

function setAuthHeader() {
    let token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  }
//setting token
setAuthHeader();
