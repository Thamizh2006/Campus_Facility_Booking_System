import React, { useRef } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasAlerted = useRef(false);

  if (!isLoggedIn) {
    if (!hasAlerted.current) {
      hasAlerted.current = true;
      alert("Login to Access Booking Features");
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
