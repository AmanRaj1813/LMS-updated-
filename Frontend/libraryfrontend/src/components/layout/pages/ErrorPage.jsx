import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const statusCode = query.get("status") || 500;
  const message = decodeURIComponent(
    query.get("message") || "Something went wrong!"
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-100 to-white text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">{statusCode}</h1>
      <p className="text-xl text-gray-800 mb-6">{message}</p>

      <Button
        variant="contained"
        color="error"
        onClick={() => navigate("/login")}
      >
        Go Back to Login
      </Button>
    </div>
  );
};

export default ErrorPage;
