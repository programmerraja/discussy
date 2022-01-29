import React from "react";
import {useState,useEffect} from "react";
import {useHistory ,useParams,Link} from "react-router-dom";
import swal from "sweetalert";

import QuestionCard from "../../components/QuestionCard";
import CardLoader from "../../components/CardLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";


function MyQuestion(){

  const [loading,setLoading]=useState(true);
  const [questions,setQuestions]=useState([]);

  useEffect(()=>{
    API.getMyQuestions()
    .then((res)=>{
        setLoading(false);
        if(res.data.status==="sucess"){
              setQuestions(res.data.questions);
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
           errorHandler(true);
      }
    });
  },[])
  
  const deleteQuestion=(question_id)=>{
     swal({
      title: "Are you sure?",
      text: "You want to delete this question.",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        API.deleteMyQuestion(question_id)
        .then((res)=>{
            setLoading(false);
            if(res.data.status==="sucess"){
              let new_question=[]
              questions.forEach(question_obj=>{
                if(question_obj._id!=question_id){
                  new_question.push(question_obj)
                }
              });
              setQuestions(new_question);
              errorHandler(false,res.data.msg);
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
    });
  }

  return ( 
    <>
      <div className="question_wrapper">
        <h3 className="text_center">Your Questions</h3>
        <CardLoader  loading={loading} />
        {
            !loading && questions.map((question)=>{
              return(
                  <QuestionCard 
                      key={question._id}
                      {...question}
                      deleteQuestion={deleteQuestion}
                      isEditing={true}/>
                ) 
            })
        }
        { 
          questions.length==0 && !loading?
          <p className="text_center">You has added No questions yet 
            <Link to="/user/addQuestion"> Add Here</Link>         
          </p>:null  
        }
      </div>
        
    </>);

  }

export default MyQuestion;