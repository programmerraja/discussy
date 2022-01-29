import React from "react";
import {useState,useEffect} from "react";
import {Link } from "react-router-dom";

import FilterBar from "../../components/FilterBar";
import CardLoader from "../../components/CardLoader";
import QuestionCard from "../../components/QuestionCard";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";

const QUERYS={
  latest:{value:"createdAt",type:-1},
  oldest:{value:"createdAt",type:1}
}

function Questions(){

  const[loading,setLoading]=useState(true);

  const[questions,setQuestions]=useState([]);
  const[search_content,setSearchContent]=useState("");
  const[sort_by,setSortBy]=useState();

  let isFind=0;
  
  useEffect(()=>{
  	//getting ques
  	API.getQuestions()
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
      res=res.response;
      if(res.data && res.data.msg){
         	errorHandler(true,res.data.msg);
      }else{
         	errorHandler(true);
      }
    });
  },[])

  //to sort the question by latest and old
  const sortQuestions=(sort_by)=>{
  	if(sort_by){
	  	let query={...QUERYS[sort_by]}
		API.getSortedQuestions(query)
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
  		questions.forEach((question_obj)=>{
  			if(!question_obj.desc.toLowerCase().includes(val.toLowerCase()) ){
  				question_obj.isShow=true;
  			}
  			else{
  				question_obj.isShow=false;
  			}
  		})
  }
  
  return ( 
	    <>
	    <div className="questions_wrapper">
				<div className="questions_container">
					<FilterBar search_content={search_content} search={search} setSortBy={setSortBy} sort={sortQuestions}/>
			    	<CardLoader  loading={loading}/>
				    	{
					    	 questions.length>0
					    	?
					    	(
					    		<div className="questions_content-wrapper">
						    		{questions.map((question_obj,index)=>
						    		{
						    			if(!question_obj.isShow){
						    				isFind=1;
							    			return(
							    				 <Link key={question_obj._id} to={`/question/${question_obj._id}`} className="questioncard_link"> 
							    						<QuestionCard  {...question_obj}/>
											     </Link>
							    				)
							    		}
						    		})

						    	}
						    	{!isFind && (<div className="questions_content">
							    					<p className="questions_content-text">No question find with name {search_content}</p>
							    				</div>)}
							   </div>
					    	)
					    	: !loading ?
					    	(	
					    	<div className="questionsContainer">
					    		<p> No questions found</p>
					    	</div>
					    	):null
				    }
				 </div>
				</div>
	    </>);
	

}

export default Questions;