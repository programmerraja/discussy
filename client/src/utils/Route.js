import React from "react";
import { Route, Redirect } from "react-router-dom";
import API from "./API";

function ProtectedRoute({ path, component: Component }) {
	return(<Route exact
				path={path}
				render={(props) => (	
				API.isAuth() && !API.checkTokenExp()? 
				<Component  /> :
				<Redirect to='/signin' />
				)}
				/>);
}

function UserRestrictedRoute({ path, component: Component }) {
	return(<Route exact
				path={path}
				render={(props) => (	
				!API.isAuth() ? 
				<Component  /> :
				<Redirect to='/user/profile' />
				)}
				/>);
}

export default {
	UserRestrictedRoute:UserRestrictedRoute,
	ProtectedRoute:ProtectedRoute
};
