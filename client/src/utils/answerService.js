import axios from "axios";

export default {
  getAnswers:function(question_id){
    return axios.get(`/getAnswers/${question_id}`);
  },
  getSortedAnswers:function({value,type,question_id}){
    return axios.get(`/answers/${question_id}/?sortBy=${value}&type=${type}`);
  }
};