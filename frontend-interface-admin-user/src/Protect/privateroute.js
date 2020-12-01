import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth"
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
	const { currentUser } = useContext(AuthContext);
	//Redirect to redirecciona al inicio en caso de no haberse logueado
	return (

		<Route
			{...rest}
			render={routeProps => !!currentUser ?
				(<RouteComponent{...routeProps} />) :
				(<Redirect to={"/"} />)
			}
		/>
	);
};

export default PrivateRoute