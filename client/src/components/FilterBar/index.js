import React from "react";
import {Link } from "react-router-dom"; 

import userImg from "../../img/user.svg";

import "./style.css";

function FilterBar({search_content,search,setSortBy,sort}){
  return ( 
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
		                          	sort(e.target.value);}}>
			                  <option value="">None</option>
			                  <option value="latest">Latest</option>
			                  <option value="oldest">Old</option>
		                 </select>
	                 </div>
					</div>	
  	)
    }

export default FilterBar;
