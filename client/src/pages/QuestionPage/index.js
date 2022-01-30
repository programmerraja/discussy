import React from "react";
import {useState,useEffect} from "react";
import {useParams,useHistory} from "react-router-dom";
import swal from "sweetalert";

import QuestionCard from "../../components/QuestionCard";
import AnswerCard from "../../components/AnswerCard";
import CardLoader from "../../components/CardLoader";
import PopupForm from '../../components/PopupForm';

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";


const QUERYS={
  latest:{value:"createdAt",type:-1},
  oldest:{value:"createdAt",type:1}
}

function QuestionPage({isLoggedin}){

  const [loading,setLoading]=useState(true);

  const [answers,setAnswers]=useState([]);
  const [question,setQuestion]=useState("");

  const [answer,setAnswer]=useState("");
  const [show_answer,setShowAnswer]=useState(false);
  const [sort_by,setSortBy]=useState();

  const {QUESTION_ID} = useParams();
  const history = useHistory();

  useEffect(()=>{
    setLoading(true);
    API.getAnswers(QUESTION_ID)
    .then((res)=>{
        setLoading(false);
        if(res.data.status==="sucess"){
              setQuestion(res.data.answers.question)
              setAnswers(res.data.answers.answers);
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
  },[QUESTION_ID])

  const sortAnswer=(sort_by)=>{
    if(sort_by){
      let query={question_id:QUESTION_ID,...QUERYS[sort_by]}
      API.getSortedAnswers(query)
      .then((res)=>{
          if(res.data.status==="sucess"){
              setAnswers(res.data.answers.answers);
              setLoading(false);
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

  const likeMyQuestion=(question_id)=>{
    API.likeMyQuestion(question_id)
  }

  const likeMyAnswer=(answer_id)=>{
    API.likeMyAnswer(answer_id)
  }

  const writeAnswer=()=>{
    //allow only if user logged in else redirect
    if(isLoggedin){
      setShowAnswer(true)
    }else{
       history.push("/signin")
    }
  }
  
  const submitAnswer=()=>{
    setShowAnswer(false)
    if(answer){
      setLoading(true);
      API.addMyAnswer({answer,question_id:QUESTION_ID})
      .then((res)=>{
          setLoading(false);
          if(res.data.status==="sucess"){
              errorHandler(false,"Thanks for adding answer");
              //adding new answer to old answer
              setAnswers([{...res.data.answer},...answers])
              //setting answer to empty str
              setAnswer("")
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

  return ( 
    <>
      <div className="discuss_wrapper">
        <PopupForm 
            show_answer={show_answer} 
            setShowAnswer={setShowAnswer} 
            answer={answer} 
            setAnswer={setAnswer} 
            submitAnswer={submitAnswer}
        />

        <CardLoader loading={loading} no={1}/>
        
        {
              (!loading && 
              question.desc)
              ? 
              <QuestionCard key={question._id} likeMyQuestion={likeMyQuestion} {...question} />  
              :null
        }

        <div className="filter_option-wrapper">
          <div>
            <label className="filter_option-label">
                   <span>Sort By: </span></label>
                   <select
                          className="filter_option" 
                          onChange={(e)=>{
                            setSortBy(e.target.value);
                            sortAnswer(e.target.value);}}>
                    <option value="">None</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                 </select>
          </div>
          <div>
              <button className="discuss_button" onClick={writeAnswer}>Write Answer</button>
          </div>
        </div>

        <CardLoader loading={loading} no={2}/>
        
        {
            !loading && answers &&  answers.map((answer)=>
              {
                return(
                    <AnswerCard 
                        key={answer._id}
                        likeMyAnswer={likeMyAnswer}
                        user={answers.user}
                        {...answer}/>  
                  ) 
              })
        }
        
        {
            !loading && 
            answers && 
            answers.length==0 ? (<p>Nobody Answered Yet</p>) :null
        }
      </div>
        
    </>);

  }

export default QuestionPage;