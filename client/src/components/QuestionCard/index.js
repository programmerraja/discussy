import React from "react";
import {Link } from "react-router-dom"; 

import userImg from "../../img/user.svg";

import "./style.css";

function QuestionCard({_id,topics,desc,user,createdAt,updatedAt,isEditing,deleteQuestion}){
  return ( 
    <>
        <div className="questioncard_container" >
            {isEditing &&
              <div className="edit_icon">
                <Link to={`/user/edit/question/${_id}`}>
                 <i className="fas fa-edit"></i>
                </Link>
              </div>
            }
            
            <div className="questioncard_user-data">
                <img src={userImg} alt="user" className="questioncard_img"/>
                <p className="questioncard_text">{user.name}</p>
            </div>
            
            <div className="questioncard_date">
               {createdAt &&
                  <p className="questioncard_text-small">
                    {new Date(createdAt).toDateString()}
                  </p>
               }
               {(updatedAt && createdAt && new Date(updatedAt).getTime()!==new Date(createdAt).getTime())?
                    <p className="questioncard_text-small">
                      (Edited)
                    </p>:null
               }
            </div>
      
            <div className="questioncard_text-wrapper">
                 {
                  desc.split("\n")
                      .map((text,index)=>{
                                return(<p key={index} className="questioncard_text">{text}</p>)
                      })
                  }
            </div>

            <div className="questioncard_topic">
               {topics && topics.length>0 && topics.map((topic,index)=>{
                  return(
                      <p key={index} className="questioncard_topic-text">
                        {topic}
                      </p>)
                  })
               }
            </div>

            {isEditing &&
              <>
                <div className="edit_icon">
                  <i className="fas fa-trash-alt" onClick={()=>{deleteQuestion(_id)}}></i>
                </div>
                <Link to={`/question/${_id}`} className="questioncard_link"> 
                      View question
                </Link>
              </>
            }
        </div>
    </>);

    }

export default QuestionCard;
