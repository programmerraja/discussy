import React from "react";

import "./style.css";

function PopupForm({show_answer,setShowAnswer,answer,setAnswer,submitAnswer}){

  if(!show_answer){
    return null
  }else{
    return ( 
        <div className="popup_form-wrapper">

            <div className="popup_form">
              <div className="popup_form-input">
               <textarea 
                 type="textarea" 
                 name="answer" 
                 placeholder="Your Answer Here"  
                 rows="10" 
                 cols="30"
                 required={true}
                 value={answer}
                 className="popup_form-textarea"
                 onChange={(e)=>setAnswer(e.target.value)}>
                </textarea>
              </div>

              <div className="popup_form-btn">
                <button  className="popup_form-btncancel" onClick={()=>{setShowAnswer(false)}}>Close</button>
                <button className="popup_form-btnsubmit" onClick={submitAnswer}>Submit</button>
              </div>           
            </div>
            </div>
      );
  }



}

export default PopupForm;
