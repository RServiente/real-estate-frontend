import React from "react";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  return localStorage.getItem("admin_valid") ? (
    children
  ) : (
    <Navigate to="/admin" />
  );
};

export default AdminPrivateRoute;
