import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

function AddProperty({ property, onFormSubmit }) { // Accept property and callback as props
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // To track success

  useEffect(() => {
    if (property) {
      setPropertyData(property); // Load existing property if editing
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
  
    try {
      let response;
      if (property) {
        response = await axios.put(`http://localhost:3001/properties/edit/${property.id}`, propertyData, { withCredentials: true });
      } else {
        const userID = localStorage.getItem("userID");
        response = await axios.post("http://localhost:3001/properties/add", { ...propertyData, userID }, { withCredentials: true });
      }
  
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError("");
        if (onFormSubmit) onFormSubmit(); // Call this to go back to the list view
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save property.");
      setSuccess(false);
    }
  };

  return (
    <>
      <h2>{property ? "Edit Property" : "Add Property"}</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={propertyData.title}
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
                value={propertyData.description}
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
                value={propertyData.price}
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
                value={propertyData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit">
          {property ? "Update Property" : "Add Property"}
        </Button>
      </Form>

      {/* Display success or error messages */}
      {success && <Alert variant="success" className="mt-3">Property saved successfully!</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </>
  );
}

export default AddProperty;
