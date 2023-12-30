import React from 'react';
import { Navigate } from 'react-router-dom';
import Profile from "./Profile";
const PrivateRoute = ({isAuthenticated}) => {
    return isAuthenticated ? <Profile /> : <Navigate to={"/login"}/>
};

export default PrivateRoute;
