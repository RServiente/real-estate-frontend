import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


// Importing image assets correctly in Vite
//import backgroundImg from '../../src/assets/image1.png';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is already authenticated upon component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/profile", { withCredentials: true })
      .then((results) => {
        if (results.data.Status === "Success") {
          const role = results.data.role;
          const userID = results.data.userID;
          const username = results.data.username;

          // Store user data in localStorage
          localStorage.getItem("username", username);
          localStorage.getItem("userID", userID);

          if (role === "admin") {
            navigate("/admin/dashboard/${userID}");
          } else {
            navigate(`/dashboard/${userID}`);
          }
        }
      })
      .catch((err) => {
        console.log("Not authenticated or failed to fetch profile", err);
      });
  }, [navigate]);

  const login = () => {
    axios
      .post(
        "http://localhost:3001/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.Status === "Success") {
          const userID = response.data.userID;
          localStorage.setItem("valid", true);

          localStorage.setItem("username", username);
          localStorage.setItem("userID", userID);

          setError("");

          const role = response.data.role;
          if (role === "admin") {
            navigate(`/admin/dashboard/${userID}`);
          } else {
            navigate(`/dashboard/${userID}`);
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again later.");
      });
  };

  return (
    
    <div>
      <h1>Login System</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    );
  };
  

export default Login;
