import {useEffect} from "react";
import {useHistory } from "react-router-dom";

import API from "../../utils/API";

function Logout ({setUser}){
  localStorage.removeItem("token");
  const history = useHistory();


  useEffect(()=>{
    API.logout();
    setUser(false);
    history.push("/");	
  },[]);

  return null
}

export default Logout;