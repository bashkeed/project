import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { mdiCubeOutline,} from "@mdi/js";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { mdiFlag, mdiHeart } from "@mdi/js";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
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

            <div className="vh-100 vw-80">
              <p>
                <Icon path={mdiFlag} size={2} className="flag" />
                explore <strong>Nigeria's </strong>first e-learning quiz
                platform dedicated to current affairs and history
              </p>
              <p>
                made for <strong>Nigerians</strong>, by{" "}
                <strong>Nigerians</strong>
                <span>
                  <Icon path={mdiHeart} size={2} className="heart" />
                </span>
              </p>
              <div className="d-flex ">
                <Link
                  to={"/signup"}
                  className="btn btn-success rounded-2 transparent reg m-2"
                >
                  Sign Up
                </Link>
                <p className="">to get started</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
