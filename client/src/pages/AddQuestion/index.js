import React from "react";
import {useState,useEffect} from "react";
import {useHistory } from "react-router-dom";

import SquareLoader from  "../../components/SquareLoader";

import Form from "../../components/Form"

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css"

function AddQuestion() {

   const[loading,setLoading]=useState(false);

   const[question,setQuestion]=useState("");
   const[topics,setTopics]=useState([]);

   const history = useHistory();
   
   let validateForm=()=>{
        if(topics && question){
            return true;
       }else{
          return false;
       }
   }

   let submitQuestion=()=>{
      if(validateForm()){
          setLoading(true);
          let arr_topics=topics.split(",")
          API.addMyQuestion({topics:arr_topics,question})
            .then((res)=>{
                   setLoading(false);
                   if(res.data.status==="sucess"){
                     errorHandler(false,
                      res.data.msg
                      ).then(()=>{history.push("/user/myQuestions");});
                   }
                   else{
                      errorHandler(true,res.data.msg)
                   }
             })
             .catch((res)=>{
                setLoading(false)
                res=res.response
                if(res.data && res.data.msg){
                      errorHandler(true,res.data.msg);
                }else{
                      errorHandler(true);
                }
            });
      }
   }
                      

  return ( <>
            <SquareLoader  loading={loading}/>
            <div className="question_wrapper">
              <div className="question_container">
                    <Form topics={topics} setTopics={setTopics} question={question} setQuestion={setQuestion}/>
                    <button onClick={submitQuestion} className="question_button">Add Question</button>
              </div>
            </div>
          </>);

}

export default AddQuestion;