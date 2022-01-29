import React from "react";
import {useState,useEffect} from "react";
import {Link } from "react-router-dom";

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
	    <div className="questions_wrapper">
				<div className="questions_container">
					<div className="questions_search-wrapper">
					 <input type="text" 
					 		className="questions_search" 
					 		placeholder="Search here.."
					 		value={search_content}
					 		onChange={(e)=>{search(e.target.value)}}
					 />
					 <div className="filter_option-wrapper">
						 <label className="filter_option-label">
		                   <span>Sort By: </span></label>
						   <select
		                          className="filter_option" 
		                          onChange={(e)=>{
		                          	setSortBy(e.target.value);
		                          	sortQuestions(e.target.value);}}>
			                  <option value="">None</option>
			                  <option value="latest">Latest</option>
			                  <option value="oldest">Old</option>
		                 </select>
	                 </div>
					</div>
			    	<CardLoader  loading={loading}/>
				    	{
					    	 questions.length>0
					    	?
					    	(
					    		<div className="questions_content-wrapper">
						    		{questions.map((questionObj,index)=>
						    		{
						    			if(!questionObj.isShow){
						    				isFind=1;
							    			return(
							    				 <Link key={questionObj._id} to={`/question/${questionObj._id}`} className="questioncard_link"> 
							    						<QuestionCard  {...questionObj}/>
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