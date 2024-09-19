import React, { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import axios from "axios";
import AddProperty from './AddProperty'; // Import the AddProperty component

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [editProperty, setEditProperty] = useState(null); // Manage edit mode
  const [isEditing, setIsEditing] = useState(false); // Toggle between list and form

  const fetchProperties = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await axios.get(`http://localhost:3001/properties/user/${userID}`, { withCredentials: true });
      setProperties(response.data.properties);
    } catch (error) {
      setError("Failed to fetch properties.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []); // Fetch properties on component mount

  const handleEdit = (property) => {
    setEditProperty(property); // Set the selected property for editing
    setIsEditing(true); // Toggle to editing mode
  };

  const handleFormSubmit = () => {
    setIsEditing(false); // Go back to the property list after submitting the form
    setEditProperty(null); // Reset editProperty after submission
    fetchProperties(); // Refresh the property list after editing
  };

  return (
    <>
      {isEditing ? (
        <AddProperty
          property={editProperty} // Pass the selected property to the form
          onFormSubmit={handleFormSubmit} // Callback to switch back after submission
        />
      ) : (
        <>
          <h2>Your Properties</h2>
          <Button variant="info" onClick={fetchProperties}>Refresh</Button>
          {error && <Alert variant="danger">{error}</Alert>}
          {properties.length > 0 ? (
            <Table striped bordered hover className="mt-3">
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
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(property)}
                      >
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
        </>
      )}
    </>
  );
}

export default PropertyList;
