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
// import { useNavigate } from "react-router";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import MainPage, { HandleParams } from "./MainPage";

const saltAndPepper = bcrypt.genSaltSync(10);
const logInEndpoint = "login/";
const signUpEndpoint = "signup/";
const inEndpoint = "in/";

let page = "<></>";

const RenderAuth = () => {
  if (page) {
    return <>{parse(page)}</>;
  } else {
    return (
      <>
        <div></div>
      </>
    );
  }
};

function App() {
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
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route path=":pointlessToken" element={<HandleParams />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
