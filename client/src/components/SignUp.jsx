
import { Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { mdiAccountCheckOutline } from "@mdi/js";
import { MDBIcon } from "mdb-react-ui-kit";
import Icon from "@mdi/react";
// import Toast from './Toast';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles



const SignUp = () => {
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
        .post("http://127.0.0.1:3000/api/auth/signup", formData)
        .then((result) => {
          console.log(result);

          // Show the popup after 1 second
          const showTimeout = setTimeout(() => {
            setShowSuccess(true); // Make the popup visible

            // Automatically hide the popup after 3 seconds
            const hideTimeout = setTimeout(() => {
              setShowSuccess(false);
            }, 3000);

            // Cleanup hideTimeout when popup is shown
            return () => clearTimeout(hideTimeout);
          }, 1000); // Adjust this value for the delay before showing

          // Cleanup showTimeout when the component unmounts
          return () => clearTimeout(showTimeout);
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
   
     const notify = () => toast("Wow so easy!");
   

  return (
    <>
      {showSuccess && (
        <>
          <div
            className="d-flex flex-column justify-content-center align-items-center bg-dark vh-100"
            role="alert"
          >
            <h1 style={{ color: "#fff" }}>user succesfully registerd!</h1>
            <Icon
              path={mdiAccountCheckOutline}
              size={3}
              style={{ color: "green" }}
            />
          </div>
        </>
      )}
      <Helmet>
        <title>learnFly - Signup</title>
      </Helmet>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 style">
        <div className="bg-white p-3 rounded w-25 skin">
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit}>
            {/* name field */}
            <div className="mb-3">
              <MDBIcon fas icon="user me-1" size="sm" />
              <input
                type="text"
                placeholder="enter username"
                autoComplete="off"
                name="name"
                className="form-control rounded-1"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="errors">{errors.name}</p>}
            </div>
            {/* email field */}
            <div className="mb-3">
              <MDBIcon fas icon="envelope me-1" size="sm" />
              <input
                type="email"
                placeholder="enter email"
                autoComplete="off"
                name="email"
                className="form-control rounded-1"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </div>

            {/* password field */}
            <div className="mb-3">
              <MDBIcon fas icon="lock me-1" size="sm" />
              <input
                type="password"
                placeholder="enter password"
                autoComplete="off"
                name="password"
                className="form-control rounded-1"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="errors">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 rounded-1 transparent"
            >
              Register
            </button>
          </form>
          {/* button */}

          <p>Already have an account ?</p>
          <Link
            to={"/login"}
            className="btn btn-default border w-100 bg-light rounded-1 text-decoration-none transparent"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignUp