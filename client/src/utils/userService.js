import axios from "axios";

export default {
  //user
  signIn: function (userCred) {
    return axios.post("/user/signin",userCred);
  },
  signUp: function (userCred) {
    return axios.post("/user/signup/",userCred);
  },
  verfiyEmail:function(user_id){
    return axios.get(`/user/verifiyMyEmail/${user_id}`);
  },
  getMyProfile:function(){
    return axios.get("/user/getMyProfile/");
  },
  updateMyProfile:function(user){
    return axios.post("/user/updateMyProfile/",user);
  },
  sendForgetPassword:function(email){
    return axios.post("/user/forgetMypassword",{email:email});
  },
  sendResetPassword:function(password_data){
    return axios.post("/user/resetMypassword",password_data);
  },
  logout:function(){
    return axios.get("/user/logout/");
  },
  
  //questions
  getMyQuestions:function(){
    return axios.get("/user/getMyQuestions/");
  },
  getMyQuestion:function(question_id){
    return axios.get(`/user/getMyQuestion/${question_id}`);
  },
  addMyQuestion:function(review){
    return axios.post("/user/addMyQuestion/",review);
  },
  updateMyQuestion:function(question){
    return axios.post("/user/updateMyQuestion/",question);
  },
  deleteMyQuestion:function(question_id){
    return axios.get(`/user/deleteMyQuestion/${question_id}`);
  },

  //answers
  getMyAnswers:function(){
    return axios.get("/user/getMyAnswers/");
  },
  getMyAnswer:function(answer_id){
    return axios.get(`/user/getMyAnswer/${answer_id}`);
  },
  addMyAnswer:function(answer){
    return axios.post("/user/addMyAnswer/",answer);
  },
  updateMyAnswer:function(answer){
    return axios.post("/user/updateMyAnswer/",answer);
  },
  deleteMyAnswer:function(answer_id){
    return axios.get(`/user/deleteMyAnswer/${answer_id}`);
  },
  
};