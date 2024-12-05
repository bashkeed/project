import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { MDBIcon } from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [errors, setErrors] = useState({}); // State to hold error messages
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Show the loader
      axios
        .post("http://127.0.0.1:3000/api/auth/login", formData)
        .then((result) => {
          setLoading(false); // Hide the loader
          localStorage.setItem("token", result.data.token);
          navigate("/dashboard");
        })
        .catch((error) => {
          setLoading(false); // Hide the loader

          if (error.response && error.response.status === 401) {
            toast.error("Invalid email or password.");
          } else {
            toast.error("An error occurred. Please try again.");
          }

          console.log(error);
        });
    } else {
      toast.error("Username or password incorrect");
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
      <ToastContainer />
      <Helmet>
        <title>learnFly - Login</title>
      </Helmet>

      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100 style">
        <div className="bg-white p-3 rounded  ">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {/* email field */}
            <div className="mb-3">
              <MDBIcon fas icon="envelope me-1" size="sm" />
              <input
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                name="email"
                className="form-control rounded-1 ctrl"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="errors">{errors.email}</p>}
            </div>

            {/* password field */}
            <div className="mb-3 position-relative">
              <MDBIcon fas icon="lock me-1" size="sm" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="off"
                name="password"
                className="form-control rounded-1 ctrl"
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
                "Login"
              )}
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
