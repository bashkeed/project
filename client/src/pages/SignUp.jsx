import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { mdiAccountCheckOutline } from "@mdi/js";
import { MDBIcon } from "mdb-react-ui-kit";
import Icon from "@mdi/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles
import api from "../utils/api";

const SignUp = () => {
  const [errors, setErrors] = useState({}); // State to hold error messages
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [formData, setFormData] = useState({
    number:"",
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Show the loader
      api
        .post("/auth/signup", formData)
        .then((result) => {
          setLoading(false); // Hide the loader
          setShowSuccess(true); // Show success message
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
        .catch((error) => {
          setLoading(false); // Hide the loader
          if (error.response && error.response.status === 400) {
            toast.error("User already exists. Please log in.");
          } else {
            toast.error("Server error. Please try again.");
          }
          console.log(error);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


   const validatePhoneNumber = (number) => {
     const phoneRegex =
       /^(\+?234|0)?(70[0-9]|80[0-9]|81[0-9]|90[0-9]|91[0-9]|70[0-9]|71[0-9])[0-9]{7}$/;
     return phoneRegex.test(number);
   };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.name) {
      tempErrors.name = "Username is required";
      isValid = false;
    }


     
    // Phone number validation
    if (!formData.number ) {
      tempErrors.number = "Phone number is required";
      isValid = false;
    } else if (!validatePhoneNumber(formData.number)) {
      tempErrors.number =
        "Invalid phone number. It should be an 11-digit Nigerian phone number.";
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
    } else if (formData.password.length <8 ) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  return (
    <>
      {showSuccess && (
        <div
          className="d-flex flex-column justify-content-center align-items-center bg-dark vh-100"
          role="alert"
        >
          <h1 style={{ color: "#fff" }}>User successfully registered!</h1>
          <Icon
            path={mdiAccountCheckOutline}
            size={3}
            style={{ color: "green" }}
          />
        </div>
      )}
      <ToastContainer />
      <Helmet>
        <title>learnFly - Signup</title>
      </Helmet>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 vw-100 style contain ">
        <div className="bg-white p-3 mr-6 rounded-2">
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit}>
            {/* phoneNumber field */}
            <div className="mb-3">
              <MDBIcon
                fas
                icon="phone me-1"
                size="sm"
                style={{ color: "blue" }}
              />
              <input
                type="text"
                placeholder="Enter phone number"
                autoComplete="off"
                name="number"
                className="form-control "
                value={formData.number}
                onChange={handleChange}
              />
              {errors.number && <p className="errors">{errors.number}</p>}
            </div>
            {/* name field */}
            <div className="mb-3">
              <MDBIcon
                fas
                icon="user me-1"
                size="sm"
                style={{ color: "blue" }}
              />
              <input
                type="text"
                placeholder="Enter username"
                autoComplete="off"
                name="name"
                className="form-control "
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="errors">{errors.name}</p>}
            </div>
            {/* email field */}
            <div className="mb-3">
              <MDBIcon
                fas
                icon="envelope me-1"
                size="sm"
                style={{ color: "blue" }}
              />
              <input
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                name="email"
                className="form-control "
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </div>
            {/* password field */}
            <div className="mb-3 position-relative">
              <MDBIcon
                fas
                icon="lock me-1"
                size="sm"
                style={{ color: "blue" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="off"
                name="password"
                className="form-control rounded-1"
                value={formData.password}
                onChange={handleChange}
              />
              <MDBIcon
                fas
                icon={showPassword ? "eye-slash" : "eye"}
                size="sm"
                className="position-absolute"
                style={{
                  top: "45px",
                  right: "10px",
                  cursor: "pointer",
                  transform: "translateY(-50%)",
                  color:'blue',
                }}
                onClick={() => setShowPassword(!showPassword)}
              />
              {errors.password && <p className="errors">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 rounded-1 transparent"
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Loading...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
