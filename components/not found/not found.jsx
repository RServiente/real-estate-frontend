import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NotFound() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status with the backend
    axios.get("http://localhost:3001/auth/check", { withCredentials: true })
      .then((response) => {
        if (response.data.Status === "Success") {
          // Redirect to user dashboard if authenticated
          navigate(`/user/dashboard/${response.data.userID}`);
        } else {
          // Redirect to login page if not authenticated
          navigate("/");
        }
      })
      .catch(() => {
        // Redirect to login page on error
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for does not exist.</p>
    </div>
  );
}


// import React from "react";
// import { useNavigate } from "react-router-dom";

// function NotFound() {
//   const navigate = useNavigate();

//   const handleRedirect = () => {
//     const token = localStorage.getItem("token"); // Assuming the token is stored in local storage

//     if (token) {
//       // Redirect to the user dashboard if the token is present
//       navigate(`/user/dashboard/${localStorage.getItem("userID")}`);
//     } else {
//       // Redirect to the login page if no token is present
//       navigate("/");
//     }
//   };

//   return (
//     <div>
//       <h1>404 - Page Not Found</h1>
//       <p>Sorry, the page you're looking for does not exist.</p>
//       <button onClick={handleRedirect}>Go to Appropriate Page</button>
//     </div>
//   );
// }

// export default NotFound;


export default NotFound;
