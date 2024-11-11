import React, { useState} from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { mdiCubeOutline, mdiAccountCheckOutline } from "@mdi/js";
//import { Link } from "react-router-dom";
import { MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import { mdilHeart, mdilFlag,mdilArrowRight } from "@mdi/light-js";
import axios from "axios";
import {
  MDBIcon,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { mdiFlag, mdiHeart } from "@mdi/js";
import { Link } from "react-router-dom";

const Home = () => {
  const [errors, setErrors] = useState({}); // State to hold error messages
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    console.log("i got here");
    e.preventDefault();

    if (validateForm()) {
      axios
        .post("http://127.0.0.1:3000/signup", formData)
        .then((result) => {
          console.log(result);

         

        
        })
        .catch((error) => console.log(error));

      console.log("Form submitted:", formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.name) {
      tempErrors.name = "Username is required";
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  return (
    <>
      {showSuccess && (
        <>
          <div className="success-message">user succesfully registerd!</div>
          <Icon path={mdiAccountCheckOutline} size={2} />
        </>
      )}

      <Helmet>
        <title>learnFly - home</title>
      </Helmet>
      <div className="container">
        <div className="home">
          <section>
            <div>
              <Icon
                path={mdiCubeOutline}
                size={3}
                color={"yellow"}
                rotate={90}
                spin
              />
            </div>
            <h1>
              <code>Welcome to learnFly!</code>
            </h1>

            <div>
              <p>
                <Icon path={mdiFlag} size={2} className="flag" />
                explore <strong>Nigeria's </strong>first e-learning platform
                dedicated to current affairs and history
              </p>
              <p>
                made for <strong>Nigerians</strong>, by{" "}
                <strong>Nigerians</strong>
                <span>
                  <Icon path={mdiHeart} size={2} className="heart" />
                </span>
              </p>
            </div>
            <div className="d-flex just  ">
              <Link to={'/signup'} className="btn btn-success rounded-2 transparent reg m-2">
                Sign Up
              </Link>
              <p className="">to get started</p>
            </div>
          </section>
        </div>

        <div className="d-flex justify-content-center align-items-center bg-body-secondary vh-100">
          <div className="signup-container">
            {/* <p
              className="text-center h3 fw-bold "
              style={{ color: "#fff" }}
            >
              Sign up to get started
            </p>
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-col align-items-center mb-2 form-control">
                <MDBIcon fas icon="user me-1" size="sm" />
                <input
                  label="Your Name"
                  id="form1"
                  type="text"
                  className="w-100"
                  name="name"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.name && <p className="errors">{errors.name}</p>}
              </div>

              <div className="d-flex flex-col align-items-center mb-2 form-control">
                <MDBIcon fas icon="envelope me-1" size="sm" />
                <input
                  label="Your Email"
                  id="form2"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="errors">{errors.email}</p>}
              </div>

              <div className="d-flex flex-col align-items-center mb-2 form-control">
                <MDBIcon fas icon="lock me-1" size="sm" />
                <input
                  label="Password"
                  id="form3"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="errors">{errors.password}</p>}
              </div>

              <button className="mb-4" size="sm">
                Register
              </button>
              <p style={{ color: "#fff" }}>
                already have an account? sign in
                <span>
                  <Icon path={mdilArrowRight} size={2} className="arrow" />
                </span>
              </p>

              
            </form> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
