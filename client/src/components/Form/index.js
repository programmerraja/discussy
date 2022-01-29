import {React,useState} from "react";

function Form({topics,question,setTopics,setQuestion}) {

   return ( <>
                
                   <div  className="question_from">
                   <label htmlFor="topics" className="question_label">
                   <span>Topics<span className="red_color">*</span></span></label>
                          <div className="question_input-wrapper">
                              <input placeholder="programming,javascript"
                                    className="question_input" 
                                    name="topics"  
                                    value={topics}
                                    onChange={(e)=>{
                                           setTopics(e.target.value);
                                  }}
                                />
                         </div>
                   </div> 

                  <div  className="question_from">
                   <label htmlFor="question" className="question_label">
                   <span>Question <span className="red_color">*</span></span></label>
                          <div className="question_input-wrapper">
                              <textarea placeholder="your question goes here" 
                                    rows="7"
                                    cols="24" 
                                    name="question"  
                                    className="question_textarea" 
                                    value={question}
                                    onChange={(e)=>{
                                           setQuestion(e.target.value);
                                  }}
                                >
                             </textarea>
                         </div>
                   </div> 
          </>);

}

export default Form;
