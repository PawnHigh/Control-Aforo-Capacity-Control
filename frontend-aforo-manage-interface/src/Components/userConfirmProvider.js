import React, { useContext, useCallback } from 'react';
import { withRouter, Redirect } from "react-router"
import { auth } from '../Conection/firebaseconection'
import { AuthContext } from "../context/auth"

const UserPresent = () => {

    const { currentUser } = useContext(AuthContext)
    if (currentUser) {
        return <Redirect to="/admin" />
    }
   
    return (
        <div >
           
        </div>
    );
}
export default withRouter(UserPresent);