import axios from "axios";

export default {
  getQuestions:function(){
    return axios.get("/getQuestions/");
  },
  getSortedQuestions:function({value,type}){
    return axios.get(`/getSortedQuestions/?sortBy=${value}&type=${type}`);
  }
};