import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; // Import slick carousel styles
import "slick-carousel/slick/slick-theme.css";
import ForSaleProperties from "./properties"


import '../styles/landing.css';

//bootstrap imports
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Row, Col, Card, Image, Modal} from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";


// Importing image assets correctly in Vite
import aboutus_img from '../images/aboutus_img.png';
import house_img1 from '../images/house1.png';
import house_img2 from '../images/house2.png'
import house_img3 from '../images/house3.png';
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,

    
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      text: "Boost your product and service's credibility by adding testimonials from your clients. People love recommendations so feedback from others who've tried it is invaluable.",
      author: 'Errandeo Services',
    },
    {
      text: "Boost your product and service's credibility by adding testimonials from your clients. People love recommendations so feedback from others who've tried it is invaluable.",
      author: 'Jeffries and Madison',
    },
    {
      text: "Boost your product and service's credibility by adding testimonials from your clients.",
      author: 'Strews Inc',
    },
  ];

  const agents = [
    {
      name: "Buster Hyman",
      role: "Real Estate Agent",
      image: house_img3,
    },
    {
      name: "Holly Graham",
      role: "Real Estate Agent",
      image: house_img1,
    },
    {
      name: "Nick R. Bocker",
      role: "Real Estate Agent",
      image: house_img2,
    },
    {
      name: "Buster Hyman",
      role: "Real Estate Agent",
      image: house_img1,
    },
  ];

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
            navigate(`/admin/dashboard/${userID}`);
          } else {
            navigate(`/dashboard/${userID}`);
          }
        }
      })
      .catch((err) => {
        console.log("Not authenticated or failed to fetch profile", err);
      });
  }, [navigate]);

  const login = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
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
          } else if (role == "user") {
            navigate(`/dashboard/${userID}`);
          } 
        } else {
          setError("Invalid credentials. Please try again.");
          handleShow(); // Keep the modal open on error
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again later.");
        handleShow(); // Keep the modal open on error
      });
  };

  return (
    <div className="landing">
    <div id="nav">
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#property">Property</Nav.Link>
                  <Nav.Link href="#about">About</Nav.Link>
                  <Nav.Link href="#testimonials">Testimonials</Nav.Link>
                  <Nav.Link href="#contact">Contact</Nav.Link>
                  {/* "Sign In" link triggers the modal */}
                  <Nav.Link onClick={handleShow}>Sign In</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}


      
      {/* Modal for Sign In 
          // <div>
          //   <h1>Login System</h1>
          //   <div>
          //     <input
          //       type="text"
          //       placeholder="Username"
          //       onChange={(e) => setUsername(e.target.value)}
          //     />
          //     <input
          //       type="password"
          //       placeholder="Password"
          //       onChange={(e) => setPassword(e.target.value)}
          //     />
          //     <button onClick={login}>Login</button>
          //   </div>

          //   {error && <p style={{ color: "red" }}>{error}</p>}
          // </div>
      */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control 
              type="text" 
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
          />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
              type="password" 
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button 
            variant="primary"
             type="submit" 
             className="mt-3"
             onClick={login}
             >
              Sign In
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        {error && <p style={{ color: "red" }}>{error}</p>}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    <section id="landing__content">
        <Container>
          <Row className="justify-content-center">
            <Col className="section__text">
              <h1 className="section__text__h1 text-white">
                Finding your perfect home has never been easier -- 
                <br />  
                Start your journey with us today
              </h1>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col md="auto">
              <Button 
                variant="light"
                className="button-59"
              >
                LIST YOUR HOME
              </Button>
            </Col>
            <Col md="auto">
              <Button 
                variant="light"
                className="button-59 ms-md-5 mt-3 mt-md-0"
              >
                BUY A HOME
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    <section id="landing__about">
      <Container>
        <Row className="about__content">
          <Col md={4} className="d-flex flex-row">
            <h1 className="about__text__h1">About Us</h1>
          </Col>
          <Col md={4} className="aboutus__img__container">
            <Image src={aboutus_img} alt="About Us" fluid className="aboutus__img" />
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <p className="about__text__p1">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
          </Col>
        </Row>
      </Container>
    </section>
    <section id="landing__properties__sale">
      <ForSaleProperties/>
    </section>

    <section id="landing__info__section">
      <Container>
        <Row className="about__content">
          <Col md={4} className="d-flex flex-row">
            <h1 className="about__text__h1">We'll help you make the right decisions.</h1>
          </Col>
          <Col md={4} className="aboutus__img__container">
            <Image src={aboutus_img} alt="About Us" fluid className="aboutus__img" />
          </Col>
          <Col md={4} className="d-flex align-items-center">
            <p className="about__text__p1">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
          </Col>
        </Row>
      </Container>
    </section>

    <section id="landing__testimonials__section" className="py-5">
      <Container>
        <h1 className="text-center lnading__testimonials__heading mb-5">Testimonials</h1>
        <Row className="justify-content-center">
          {testimonials.map((testimonial, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card className="landing__testimonial__card border-0">
                <Card.Body>
                  <Card.Text>{testimonial.text}</Card.Text>
                  <p className="landing__testimonial__author mt-4">- {testimonial.author}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <section id="landing__agents__section">
      <Container fluid>
        <Row>
          <Col className="text-center">
            <h2>Our Agents</h2>
            <p>
              Get started by choosing from one of our pre-built page templates to
              showcase your properties.
            </p>
          </Col>
        </Row>

        {/* Slick Slider */}
        <Row className="mt-5">
          <Col>
            <Slider {...settings}>
              {agents.map((agent, index) => (
                <div key={index}>
                  <Card className="landing__agent__card text-center border-0">
                    <Card.Img
                      className="landing__agent__img"
                      variant="top"
                      src={agent.image}
                      alt={agent.name}
                    />
                    <Card.Body>
                      <Card.Title className="landing__agent__title">{agent.name}</Card.Title>
                      <Card.Text className="landing__agent__text">{agent.role}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </Col>
        </Row>
      </Container>
    </section>

    <section id="landing_footer_section">
      <Container>
        <Row>
          <Col md={5}>
            <h1 className="landing__footer__heading">Contact Us</h1>
          </Col>
          <Col md={6} className="landing__footer__info d-flex flex-column align-items-start">
            <p>Main Office</p>
            <p >123 Anywhere St.</p>
            <p >Any City, ST 12345</p>
            <p className="mt-5">Tel: (123) 456-7890</p>
            <p >Email: hello@reallygreatsite.com</p>
            <p >Social: @reallygreatsite</p>
          </Col>
        </Row>
        <Row className="text-center mt-5">
          <Col md={12}>
            <Button variant="outline-light" className="landing__footer__btn">
              LIST YOUR HOME
            </Button>
            <Button variant="light" className="landing__footer__btn ms-3">
              BUY A HOME
            </Button>
          </Col>
        </Row>
        <Row className="text-center mt-4">
          <Col md={12}>
            <FaFacebookF  className="landing__footer__icon"/>
            <FaTwitter  className="landing__footer__icon"/>
            <FaInstagram className="landing__footer__icon"/>
          </Col>
        </Row>
      </Container>
    </section>

    

    </div>
    

    

    );
  };
  

export default Login;
