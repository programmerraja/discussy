import swal from "sweetalert";

export default function errorHandler(isError,msg) {
	
	if(!isError){
		return swal({
              title: "Success",
              text: msg,
              icon: "success",
            });
	}else{
		if(!msg){
			msg="<p>Something went wrong <br>Plse try again later</p>"
		}
		return swal({
              title: "     ",
              content:{
              	element:"p",
              	attributes:{
              		innerHTML:msg,
              		className:"swal_text"
              	}
              	
              }
            });
	}
}