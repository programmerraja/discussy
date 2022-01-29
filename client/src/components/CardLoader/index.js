import React from "react";

import "./style.css";

function CardLoader({loading,no=3}) {
 
  if(loading){
      let loader=[]
      for(let i=0;i<no;i++){
          loader.push( 
            <div key={i} className="questioncard_container">
              <div className="questioncard_user-data">
                  <span className="user_img luser_img"/>
                  <span className="luser_small-text"></span>
              </div>
              <div className="questioncard_text-wrapper">
                 <p className="luser_big-text1"></p>
                 <p className="luser_big-text2"></p>
                 <p className="luser_big-text3"></p>
              </div>
            </div>)
      }
      return (
          <>
           {loader}
          </>
         
      );
  }
  else{
    return null;
  }
}

export default CardLoader;
 