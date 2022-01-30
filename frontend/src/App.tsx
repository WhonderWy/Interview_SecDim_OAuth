import { useRef, useState } from "react";
import "./App.css";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import axios from "axios";
import bcrypt from "bcryptjs";
import parse from "html-react-parser";
import { useNavigate } from "react-router";

const saltAndPepper = bcrypt.genSaltSync(10);
const logInEndpoint = "login/";
const signUpEndpoint = "signup/";
const inEndpoint = "in/"

let page = "<></>"

const RenderAuth = () => {
  if (page) {
    return <>{parse(page)}</>;
  } else {
    return <><div></div></>;
  }
}

function App() {
  const [simpleLoggedIn, setLoggedIn] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  // const navTo = useNavigate();

  const doLogIn = async () => {
    const email = emailRef.current;
    const password = passwordRef.current;
    const hashed = bcrypt.hashSync(password, saltAndPepper);

    let response;
    try {
      response = await axios.post(logInEndpoint, { email, hashed });
      if (response.status === 200 && response.data.pointlessToken) {
        localStorage.setItem("pointlessToken", response.data.pointlessToken);
        localStorage.setItem("email", email);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  };

  const doOAuth = () => {
    // navTo(logInEndpoint);
    window.location.href = "http://localhost:8000/login/"
  }

  const doSignUp = async () => {
    const email = emailRef.current;
    const password = passwordRef.current;
    const hashed = bcrypt.hashSync(password, saltAndPepper);

    let response;
    try {
      response = await axios.post(signUpEndpoint, { email, hashed });
      if (response.status === 200 && response.data.pointlessToken) {
        localStorage.setItem("pointlessToken", response.data.pointlessToken);
        localStorage.setItem("email", email);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }

  const doLogOut = () => {
    localStorage.clear();
  };

  return (
    <div className="App">
      <header>
        <MDBNavbar expand="lg" light bgColor="white">
          <MDBContainer fluid>
            <MDBNavbarToggler
              aria-controls="navbarExample01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <MDBIcon fas icon="bars" />
            </MDBNavbarToggler>
            <div className="collapse navbar-collapse" id="navbarExample01">
              <MDBNavbarNav right className="mb-2 mb-lg-0">
                <MDBNavbarItem active>
                  <MDBNavbarLink aria-current="page" href="#">
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="#">Portfolio</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="#">Résumé</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="#">About Me</MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </div>
          </MDBContainer>
        </MDBNavbar>
      </header>
      <div className="p-5 text-center bg-light">
        <h1 className="mb-3">Website!</h1>
        <h4 className="mb-3">
          Also, to be reused someday when I finally get around to writing my own
          website.
        </h4>
      </div>
      <div className="container">
        <MDBContainer fluid className="text-center">
          {(localStorage.getItem("pointlessToken") && (
            <MDBRow>
              <MDBCol>
                <div>
                  <h2>You're in!</h2>
                  <h3>{localStorage.getItem("email")}</h3>
                </div>
              </MDBCol>
              <MDBCol>
                <MDBBtn onClick={doLogOut}>Logout</MDBBtn>
              </MDBCol>
            </MDBRow>
          )) || (
            <MDBRow>
              <MDBCol md="6">
                <form>
                  <p className="h5 text-center mb-4">Sign in</p>
                  <div className="grey-text">
                    <MDBInput
                      label="Type your email"
                      icon="envelope"
                      group
                      type="email"
                      validate
                      error="Invalid"
                      ref={emailRef}
                      success="right"
                    />
                    <MDBInput
                      label="Type your password"
                      icon="lock"
                      group
                      type="password"
                      validate
                      ref={passwordRef}
                    />
                  </div>
                  <div className="text-center">
                    <MDBBtn
                      onClick={(e: { preventDefault: () => void; }) => {
                        e.preventDefault();
                        doOAuth();
                      }}
                    >
                      Login with GitHub
                    </MDBBtn>
                    <MDBBtn
                      onClick={(e: { preventDefault: () => void; }) => {
                        e.preventDefault();
                        doLogIn();
                      }}
                    >
                      Login
                    </MDBBtn>
                    <MDBBtn
                      onClick={(e: { preventDefault: () => void; }) => {
                        e.preventDefault();
                        doSignUp();
                      }}
                    >
                      Sign Up
                    </MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          )}
          <MDBRow>
            <MDBCol>
              <RenderAuth />
            </MDBCol>
          </MDBRow>
          {/* Nicked the above form from https://mdbootstrap.com/docs/react/forms/basic/ */}
        </MDBContainer>
      </div>
    </div>
  );
}

export default App;
