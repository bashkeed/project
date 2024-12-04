import React from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { mdiCubeOutline } from "@mdi/js";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { mdiFlag, mdiHeart } from "@mdi/js";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>learnFly - Home</title>
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
                <strong>Nigerians </strong>
                <span>
                  <Icon path={mdiHeart} size={2} className="heart" />
                </span>
              </p>
              <div className="d-flex flex-column align-items-start">
                <Link to={"/signup"}>
                  <button class="button" data-text="Awesome">
                    <span class="actual-text">&nbsp; Sign Up&nbsp;</span>
                    <span aria-hidden="true" class="hover-text">
                      &nbsp; &nbsp;
                    </span>
                  </button>
                </Link>

                <Link to={"/login"}>
                  <button class="button" data-text="Awesome">
                    <span class="actual-text">&nbsp; Login&nbsp;</span>
                    <span aria-hidden="true" class="hover-text">
                      &nbsp; &nbsp;
                    </span>
                  </button>
                </Link>
                <p className="mt-2">to get started</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
