import React, { useState, useEffect } from "react";
import axios from "axios";
import house_img1 from '../images/house1.png';
import '../styles/landing.css';
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';

function ForSaleProperties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/properties/forsale`);
        setProperties(response.data.properties);
      } catch (error) {
        console.error("Failed to fetch properties", error);
        setError(error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section>
      <Container>
        <div className="properties__sale__header d-flex justify-content-between">
          <h1 className="properties__sale__h1">Properties</h1>
          <p className="properties__sale__p1 mt-2">For Sale</p>
        </div>
        <div className="properties__sale__list">
          <Row>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Col key={property.id} md={4}> {/* Add the key prop here */}
                  <Card className="property-card">
                    <Card.Img variant="top" src={house_img1} />
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">HOUSE</Card.Subtitle>
                      <Card.Title>{property.title}</Card.Title>
                      <Card.Text>
                        {property.description}
                        <br />
                        <small>{property.location}</small>
                        <small>{property.price}</small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No properties listed for sale.</p>
            )}
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default ForSaleProperties;
