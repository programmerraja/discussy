import React from "react";
import {Link } from "react-router-dom";

import userImg from "../../img/user.svg";

function AnswerCard({_id,questionId,answer,user,createdAt,updatedAt,isEditing,deleteAnswer}){
  return ( 
    <>
        <div className="answercard_container">
            
            {isEditing &&
              <div className="edit_icon">
                <Link to={`/user/edit/answer/${_id}`}>
                 <i className="fas fa-edit"></i>
                </Link>
              </div>
            }

            <div className="answercard_user-data">
                <img src={userImg} alt="user" className="answercard_img"/>
                <p className="answercard_text">{user.name}</p>
            </div>
            
            <div className="answercard_date">
               {createdAt &&
                  <p className="answercard_text-small">
                    {new Date(createdAt).toDateString()}
                  </p>
                }
                {(updatedAt && createdAt && new Date(updatedAt).getTime() !==new Date(createdAt).getTime())?
                  <p className="answercard_text-small">
                    (Edited)
                  </p>:null
                }
            </div>
             
            <div className="answercard_text-wrapper">
               {
                answer.split("\n")
                    .map((text,index)=>{
                              return(<p key={index} className="answercard_text">{text}</p>)
                    })
                }
            </div>
          
            {isEditing &&
              <>
                <div className="edit_icon">
                  <i className="fas fa-trash-alt" onClick={()=>{deleteAnswer(_id)}}></i>
                </div>
                <Link to={`/question/${questionId}`} className="answercard_link"> 
                    View question
                </Link>
              </>
            }
        </div>
    </>);

    }

export default AnswerCard;
