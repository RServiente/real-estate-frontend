import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Container, Row, Col, Alert, Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import axios from "axios";

function UserDashboard() {
  const [properties, setProperties] = useState([]);
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    price: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentPropertyID, setCurrentPropertyID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userID) {
        try {
          const response = await axios.get(`http://localhost:3001/properties/user/${userID}`, { withCredentials: true });
          setProperties(response.data.properties);
        } catch (error) {
          console.error("Failed to fetch user details", error);
        }
      }
    };

    const fetchUsername = () => {
      setUsername(localStorage.getItem("username"));
    };

    const userIDFromStorage = localStorage.getItem("userID");
    setUserID(userIDFromStorage);

    fetchUserDetails();
    fetchUsername();
  }, [userID, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({ ...newProperty, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        const response = await axios.put(
          `http://localhost:3001/properties/edit/${currentPropertyID}`,
          { ...newProperty },
          { withCredentials: true }
        );
        if (response.data.Status === "Success") {
          const updatedProperties = await axios.get(`http://localhost:3001/properties/user/${userID}`, { withCredentials: true });
          setProperties(updatedProperties.data.properties);
          setError("");
          setEditMode(false);
          setCurrentPropertyID(null);
          setNewProperty({ title: "", description: "", price: "", location: "" });
        } else {
          setError("Failed to update property. Please try again.");
        }
      } else {
        const response = await axios.post(
          "http://localhost:3001/properties/add",
          { ...newProperty, userID },
          { withCredentials: true }
        );

        if (response.data.Status === "Success") {
          const updatedProperties = await axios.get(`http://localhost:3001/properties/user/${userID}`, { withCredentials: true });
          setProperties(updatedProperties.data.properties);
          setError("");
          setNewProperty({ title: "", description: "", price: "", location: "" });
        } else {
          setError("Failed to add property. Please try again.");
        }
      }
    } catch (err) {
      console.error("Failed to add or update property", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleEdit = (property) => {
    setNewProperty(property);
    setEditMode(true);
    setCurrentPropertyID(property.id);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewProperty({ title: "", description: "", price: "", location: "" });
    setCurrentPropertyID(null);
  };

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
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Real Estate Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
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
                  {username}
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
        <h2>{editMode ? "Edit Property" : "Add Property"}</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newProperty.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newProperty.price}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={newProperty.location}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="success" type="submit">
            {editMode ? "Update Property" : "Add Property"}
          </Button>
          {editMode && (
            <Button variant="secondary" className="ms-2" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <h2 className="mt-5">Your Properties</h2>
        {properties.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.title}</td>
                  <td>{property.description}</td>
                  <td>${property.price}</td>
                  <td>{property.location}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(property)} className="me-2">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>You have no properties listed.</p>
        )}
      </Container>
    </>
  );
}

export default UserDashboard;
