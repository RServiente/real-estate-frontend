import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        console.log("Update Response:", response.data);
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
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {username}!</h1>
      <h1>UserID: {userID}!</h1>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>

      <h2>{editMode ? "Edit Property" : "Add Property"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newProperty.title}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={newProperty.description}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newProperty.price}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={newProperty.location}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">{editMode ? "Update Property" : "Add Property"}</button>
        {editMode && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Your Properties</h2>
      {properties.length > 0 ? (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
              <p>Location: {property.location}</p>
              <button onClick={() => handleEdit(property)}>Edit</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no properties listed.</p>
      )}
    </div>
  );
}

export default UserDashboard;
