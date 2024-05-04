import React from "react";

//React router dom
import { Navigate } from "react-router-dom";

const ProtectedRoutes = (props) => {
  //Get token from localStorage
  const token = localStorage.getItem("token");

  //User is not logged in
  if (!token || token === "TOKEN EXPIRED") {
    //Redirect to login page
    return <Navigate to="/login" />;
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default ProtectedRoutes;
