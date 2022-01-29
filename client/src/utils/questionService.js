import axios from "axios";

export default {
  getQuestions:function(){
    return axios.get("/getQuestions/");
  },
  getSortedQuestions:function({value,type}){
    return axios.get("/questions/?sortBy="+value+"&type="+type);
  }
};