import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Container, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import PropertyList from './PropertyList'; // Import PropertyList component
import AddProperty from './AddProperty'; // Import AddProperty component

function UserDashboard() {
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // State to manage active tab
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the username from localStorage when the component mounts
    const usernameFromStorage = localStorage.getItem("username");
    setUsername(usernameFromStorage);
  }, []); // Empty dependency array ensures this effect runs only once

  const handleLogout = () => {
    axios
      .post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("valid"); // When logging out
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to logout", err);
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "list":
        return <PropertyList />;
      case "add":
        return <AddProperty />;
      default:
        return <PropertyList />;
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="#">Real Estate Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="#"
                onClick={() => setActiveTab("list")}
                active={activeTab === "list"}
              >
                Property List
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="#"
                onClick={() => setActiveTab("add")}
                active={activeTab === "add"}
              >
                Add Property
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {/* User Profile Dropdown */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <Image
                    src="https://via.placeholder.com/40" // Replace with user profile image URL if available
                    roundedCircle
                    width="30"
                    height="30"
                    alt="User Profile"
                  />{" "}
                  {username || "Username"} {/* Display the fetched username */}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container>
        {renderContent()}
      </Container>
    </>
  );
}

export default UserDashboard;
