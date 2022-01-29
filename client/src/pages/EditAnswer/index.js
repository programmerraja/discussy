import React from "react";
import {useState,useEffect} from "react";
import {useHistory ,useParams} from "react-router-dom";

import SquareLoader from  "../../components/SquareLoader";
import PopupForm from "../../components/PopupForm"

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

function EditAnswer() {

  const [loading,setLoading]=useState(true);

  const [question,setQuestion]=useState("");
  const [answer,setAnswer]=useState("");
  const [show_answer,setShowAnswer]=useState(false);

  const history = useHistory();
  const {ANSWER_ID} = useParams();

   useEffect(()=>{
     API.getMyAnswer(ANSWER_ID)
        .then((res)=>{
            setLoading(false);
            if(res.data.status==="sucess"){
                setAnswer(res.data.answer.answer);
            }else{
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
            console.log(res)
          }
       });
   },[ANSWER_ID])

   let validateForm=()=>{
        if(answer){
            return true;
       }else{
        return false;
       }
   }

   let submitAnswer=()=>{
      if(validateForm()){
          setLoading(true);
          API.updateMyAnswer({answer_id:ANSWER_ID,answer})
            .then((res)=>{
                   setLoading(false);
                   if(res.data.status==="sucess"){
                     errorHandler(false,
                      "Your Answer Updated sucessfully."
                      ).then(()=>{history.push("/user/myAnswers");});
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
              <PopupForm  
                  show_answer={!loading} 
                  setShowAnswer={()=>{history.push("/user/myAnswers")}} 
                  answer={answer} 
                  setAnswer={setAnswer} 
                  submitAnswer={submitAnswer}
              />
          </>);

}

export default EditAnswer;