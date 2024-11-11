import React from 'react'
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import  { useState } from "react";
import { Helmet } from "react-helmet";
import { MDBIcon } from "mdb-react-ui-kit";
import "react-toastify/dist/ReactToastify.css";



const Login = () => {
     const [errors, setErrors] = useState({}); // State to hold error messages
     const [showSuccess, setShowSuccess] = useState(false);
     const navigate = useNavigate()
     const [formData, setFormData] = useState({
       email: "",
       password: "",
     });

     const handleSubmit = (e) => {
       console.log("i got here");
       e.preventDefault();

       if (validateForm()) {
         axios
           .post("http://127.0.0.1:3000/login", formData)
           .then((result) => {
             console.log(result);
             navigate('/history')
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
      <Helmet>
        <title>learnFly - Login</title>
      </Helmet>

      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 style">
        <div className="bg-white-subtle p-3 rounded w-25 skin">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
              Login
            </button>
          </form>
          {/* button */}

          <p>Don't have an account ? Sign up</p>
          <Link
            to={"/signup"}
            className="btn btn-default border w-100 bg-light rounded-1 text-decoration-none transparent"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login