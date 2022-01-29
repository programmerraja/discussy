import React from "react";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import SquareLoader from "../../components/SquareLoader";

import API from "../../utils/API";

import verifiy from "../../img/verifiy.svg";

function EmailVerified()
{
	
  const [loading,setLoading]=useState(true);
  const [verified,setVerified]=useState(false);
  
  const { USER_ID } = useParams();

	function verfiyEmail(){
		API.verfiyEmail(USER_ID)
    .then((res)=>{
        setLoading(false);
        if(res.data.status==="sucess"){
          setVerified(true);
        }else{
          setVerified(false);
        }
    })
    .catch((e)=>{
        setLoading(false);
        setVerified(false);
    })
	}
  
  useEffect(()=>{
    	verfiyEmail();
 	 },[])

return(
  <>
    <SquareLoader  loading={loading}/>
    { (!loading && verified) &&
      <div class="reset_container">
        <div class="reset_img">
          <img src={verifiy} />
        </div>
        <div class="reset_text">
          <h2>Verified!</h2>
          <p>You have sucessfully verified the account </p>
        </div>
      </div>
    }
    {(!loading && !verified) &&
      <div class="reset_container">
        <div class="reset_text">
          <h2>Email Verification failed</h2>
        </div>
      </div>

    }
  
</>);

}
export default EmailVerified;