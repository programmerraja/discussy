import React from "react";
import {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import swal from "sweetalert";

import AnswerCard from "../../components/AnswerCard";
import CardLoader from "../../components/CardLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";

function MyAnswer(){

  const [loading,setLoading]=useState(true);
  const [answers,setAnswers]=useState([]);

  useEffect(()=>{
    API.getMyAnswers()
    .then((res)=>{
        setLoading(false);
        if(res.data.status==="sucess"){
              setAnswers(res.data.answers);
         }
         else{
           errorHandler(true,res.data.msg);
         }
    })
    .catch((res)=>{
      setLoading(false);
      res=res.response;
      if(res.data && res.data.msg){
           errorHandler(true,res.data.msg);
      }else{
           errorHandler(true);
      }
    });
  },[])
  
  const deleteAnswer=(answer_id)=>{
     swal({
      title: "Are you sure?",
      text: "You want to delete this answer.",
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        API.deleteMyAnswer(answer_id)
        .then((res)=>{
            setLoading(false);
            if(res.data.status==="sucess"){
              let new_answer=[]
              answers.forEach(answer_obj=>{
                if(answer_obj._id!=answer_id){
                  new_answer.push(answer_obj)
                }
              });
              setAnswers(new_answer);
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
      <div className="answer_wrapper">
        <h3 className="text_center">Your Answers</h3>
        <CardLoader  loading={loading} />
        {
            !loading && answers.map((answer)=>{
              return(
                  <AnswerCard 
                      key={answer._id}
                      {...answer}
                      deleteAnswer={deleteAnswer}
                      isEditing={true}/>
                ) 
            })
        }
        { 
          answers.length==0 && !loading?
          <p className="text_center">You has added No answers yet 
            <Link to="/questions"> Add Here</Link>         
          </p>:null  
        }
      </div>
        
    </>);

  }

export default MyAnswer;