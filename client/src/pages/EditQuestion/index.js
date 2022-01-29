import React from "react";
import {useState,useEffect} from "react";
import {useHistory ,useParams} from "react-router-dom";

import SquareLoader from  "../../components/SquareLoader";

import Form from "../../components/Form"

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

function EditQuestion() {

   const [loading,setLoading]=useState(true);

   const [question,setQuestion]=useState("");
   const[topics,setTopics]=useState();

   const history = useHistory();

   const {QUESTION_ID} = useParams();

   useEffect(()=>{
     API.getMyQuestion(QUESTION_ID)
        .then((res)=>{
            setLoading(false);
            if(res.data.status==="sucess"){
                setTopics(res.data.question.topics.toString())
                setQuestion(res.data.question.desc);
            }
        })
        .catch((res)=>{
          setLoading(false);
          res=res.response
          if(res.data && res.data.msg){
              errorHandler(true,res.data.msg);
          }else{
            errorHandler(true);
            console.log(res)
          }
       });
   },[QUESTION_ID])



   let validateForm=()=>{
        if(topics && question){
            return true;
       }
   }

   let onSubmitQuestion=()=>{
      if(validateForm()){
          setLoading(true);
          let arr_topics=topics.split(",")
          API.updateMyQuestion({topics:arr_topics,question_id:QUESTION_ID,question})
            .then((res)=>{
                   setLoading(false);
                   if(res.data.status==="sucess"){
                     errorHandler(false,
                      "Your Question added sucessfully."
                      ).then(()=>{history.push("/user/myQuestions");});
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
                    <button onClick={onSubmitQuestion} className="question_button">update Question</button>
              </div>
            </div>
          </>);

}

export default EditQuestion;