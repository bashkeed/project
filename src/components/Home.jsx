import React from 'react'
import { Helmet } from 'react-helmet';
import Icon from "@mdi/react";
import { mdiCubeOutline } from "@mdi/js";
import { Link } from "react-router-dom";
import { MDBBtn, MDBContainer } from "mdb-react-ui-kit";
import { mdilHeart, mdilFlag } from "@mdi/light-js";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";




const Home = () => (
  <>
    <Helmet>
      <title>ridStory-home</title>
    </Helmet>
    <div id="home">
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
        <h1 style={{ color: "gold" }}>
          <code>Welcome to ridStory!</code>
        </h1>

        <div>
          <p>
            <Icon path={mdilFlag} size={2} className="flag" />
            explore Nigeria's first e-learning platform dedicated to riddles and
            history
          </p>
          <p>
            made for riddle lovers, by riddle lovers
            <span>
              <Icon path={mdilHeart} size={2} className="heart" />
            </span>
          </p>
        </div>

        {/* <div className="play-button-container">
          <button id="play-button">
            <Link to="/play/instruction"></Link>play
          </button>
        </div> */}

        {/* <div className="auth-container">
          <button id="login-button" className="auth-buttons">
            <Link to="/login"></Link>Login
          </button>
          <button id="signup-button" className="auth-buttons">
            <Link to="/signup"></Link>Sign Up
          </button>
        </div> */}
      </section>

      <MDBContainer fluid>
        <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
          <MDBCardBody>
            <MDBRow>
              <MDBCol
                md="10"
                lg="6"
                className="order-2 order-lg-1 d-flex flex-column align-items-center"
              >
                <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                  Sign up to get started
                </p>

                <div className="d-flex flex-row align-items-center mb-4 ">
                  <MDBIcon fas icon="user me-3" size="lg" />
                  <MDBInput
                    label="Your Name"
                    id="form1"
                    type="text"
                    className="w-100"
                  />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="envelope me-3" size="lg" />
                  <MDBInput label="Your Email" id="form2" type="email" />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="lock me-3" size="lg" />
                  <MDBInput label="Password" id="form3" type="password" />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="key me-3" size="lg" />
                  <MDBInput
                    label="Repeat your password"
                    id="form4"
                    type="password"
                  />
                </div>


                <MDBBtn className="mb-4" size="lg">
                  Register
                </MDBBtn>
              </MDBCol>

              <MDBCol
                md="10"
                lg="6"
                className="order-1 order-lg-2 d-flex align-items-center"
              >
            
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  </>
);


export default Home