import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./common/constants";

const PublicRoute = ({ children }) => {
  const idToken = localStorage.getItem("token");
  return idToken ? <Navigate to={ROUTES.MAIN} replace /> : children;
};

export default PublicRoute;
