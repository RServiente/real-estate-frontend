import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/users", { withCredentials: true })
      .then((response) => {
        if (response.data.Status === "Success") {
          setUsers(response.data.users);
        } else {
          navigate("/");
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to logout", err);
      });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.userID}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
