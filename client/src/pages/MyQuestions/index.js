import React from "react";
import {useState,useEffect} from "react";
import {useHistory ,useParams,Link} from "react-router-dom";
import swal from "sweetalert";

import FilterBar from "../../components/FilterBar";
import QuestionCard from "../../components/QuestionCard";
import CardLoader from "../../components/CardLoader";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";

const QUERYS={
  latest:{value:"createdAt",type:-1},
  oldest:{value:"createdAt",type:1}
}

function MyQuestion(){

  const [loading,setLoading]=useState(true);
  const [questions,setQuestions]=useState([]);

  const[search_content,setSearchContent]=useState("");
  const[sort_by,setSortBy]=useState();

  let isFind=0;
  
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

  //to sort the question by latest and old
  const sortQuestions=(sort_by)=>{
    if(sort_by){
      let query={...QUERYS[sort_by]}
    API.getMySortedQuestions(query)
    .then((res)=>{
      if(res.data.status==="sucess"){
        setQuestions(res.data.questions);
      }
      else{
        errorHandler(true,res.data.msg);
      }
    })
    .catch((res)=>{
      if(res.data && res.data.msg){
          errorHandler(true,res.data.msg);
      }else{
          errorHandler(true);
      }
    });
  }
  }

  //for search
  const search=(val)=>{
      setSearchContent(val);
      questions.forEach((questionObj)=>{
        if(!questionObj.desc.toLowerCase().includes(val.toLowerCase()) ){
          questionObj.isShow=true;
        }
        else{
          questionObj.isShow=false;
        }
      })
  }
  return ( 
    <>
      <div className="question_wrapper">
        <h3 className="text_center">Your Questions</h3>
        <FilterBar search_content={search_content} search={search} setSortBy={setSortBy} sort={sortQuestions}/>
        <CardLoader  loading={loading} />
        {
            !loading && questions.map((question_obj)=>{
                    if(!question_obj.isShow){
                        isFind=1
                        return(
                            <QuestionCard 
                                key={question_obj._id}
                                {...question_obj}
                                deleteQuestion={deleteQuestion}
                                isEditing={true}/>
                          )
                    }else{
                      return null
                    }
            })
        }
        {!isFind && (<div className="questions_content">
                            <p className="questions_content-text">No question find with name {search_content}</p>
                          </div>)}
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