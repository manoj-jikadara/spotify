import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./common/constants";

const PrivateRoute = ({ children }) => {
  const idToken = localStorage.getItem("token");
  return idToken ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
