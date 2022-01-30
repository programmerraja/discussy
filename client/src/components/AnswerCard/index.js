import {React,useState} from "react";
import {Link } from "react-router-dom";

import userImg from "../../img/user.svg";

function AnswerCard({isLoggedin,_id,questionId,answer,likes=[],likeMyAnswer,user,createdAt,updatedAt,isEditing,deleteAnswer}){
  
  const [isLiked,setIsLiked]=useState(user.isLiked)
  const[likes_count,setLikesCount]=useState(likes.length)

  const likeAnswer=()=>{
    if(isLoggedin){
      likeMyAnswer(_id)
      if(isLiked){
        setLikesCount((likes_count)=>likes_count-1);
      }else{
        setLikesCount((likes_count)=>likes_count+1);
      }
      setIsLiked((isLiked)=>!isLiked);
    }

  }
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
             
            {likeMyAnswer && <div className={isLiked?"answercard_like-icon liked":"answercard_like-icon"} >
               <i className="fas fa-thumbs-up " onClick={likeAnswer}></i>{" "}{likes_count}
              </div>
            }
          
            {isEditing &&
              <>
                <div className="answercard_edit-icon">
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
