import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import parse from "html-react-parser";
// import { useParams } from "react-router";
import { useNavigate, useParams } from "react-router-dom";

const saltAndPepper = bcrypt.genSaltSync(10);
const logInEndpoint = "login/";
const signUpEndpoint = "signup/";
const inEndpoint = "in/";
const emailEndpoint = "emails/";

const USER_API_URL = "https://api.github.com/user/";
const EMAIL_API_URL = "https://api.github.com/user/emails";

let page = "<></>";

export const MainPage = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const params = window.location.search;
    const urlParams = new URLSearchParams(params);
    const access_token = urlParams.get("pointlessToken");
    if (access_token) {
      localStorage.setItem("pointlessToken", access_token);
      window.location.href = "/";
    }
  }, []);

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

  const doOAuth = async () => {
    // navTo(logInEndpoint);
    // window.location.href = "http://localhost:8000/login/";
    let response;
    try {
      response = await axios.get(logInEndpoint);
      if (response.status === 200 && response.data.redirect) {
        window.location.href = response.data.redirect;
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  };

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
  };

  const doLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getEmails = async () => {
    const token = localStorage.getItem("pointlessToken");
    const header = {
      Authorization: `token ${token}`,
      // Accept: "application/vnd.github.v3+json",
    };

    let response;
    let result: any[] = [];
    try {
      // response = await axios.get(USER_API_URL, { headers: header });
      response = await axios.get(emailEndpoint, { headers: header });
      if (response.status === 200 && response.data.emails) {
        result = result.concat(response.data.emails);
        localStorage.setItem("emails", JSON.stringify(result));
      }
      // setDisplayEmails(result);
      setShowEmail(true);
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
    return result;
  };

  const displayEmails = () => {
    interface keyable {
      [key: string]: any;
    }
    if (localStorage.getItem("emails")) {
      const listEmails: string | null = localStorage.getItem("emails");
      if (listEmails) {
        return JSON.parse(listEmails).map(
          (el: keyable | string, idx: number) => {
            if (typeof el === "string") {
              return (
                <>
                  <li key={idx}>{el}</li>
                </>
              );
            } else {
              return (
                <>
                  <li key={idx}>{el.email}</li>
                </>
              );
            }
          }
        );
      }
    } else {
      return (
        <>
          <li>Nothing here... yet...</li>
        </>
      );
    }
  };

  return (
    <>
      <MDBContainer fluid className="text-center">
        {(localStorage.getItem("pointlessToken") && (
          <div>
            <MDBRow>
              <MDBCol>
                <h2>You're in!</h2>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBBtn onClick={getEmails}>Get Email(S)!</MDBBtn>
                <MDBBtn onClick={doLogOut} color="secondary">
                  Logout
                </MDBBtn>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <ul>{displayEmails()}</ul>
              </MDBCol>
            </MDBRow>
          </div>
        )) || (
          <MDBRow>
            <MDBCol md="6">
              <form>
                <p className="h5 text-center mb-4">Sign in</p>
                <div className="grey-text">
                  <MDBInput
                    label="Type your email"
                    icon="envelope"
                    group="true"
                    type="email"
                    validate="true"
                    error="Invalid"
                    ref={emailRef}
                    success="right"
                  />
                  <MDBInput
                    label="Type your password"
                    icon="lock"
                    group="true"
                    type="password"
                    validate="true"
                    ref={passwordRef}
                  />
                </div>
                <div className="text-center">
                  <MDBBtn
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      doOAuth();
                    }}
                  >
                    Login with GitHub
                  </MDBBtn>
                  <MDBBtn
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault();
                      doLogIn();
                    }}
                  >
                    Login
                  </MDBBtn>
                  <MDBBtn
                    onClick={(e: { preventDefault: () => void }) => {
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
        {/* Nicked the above form from https://mdbootstrap.com/docs/react/forms/basic/ */}
      </MDBContainer>
    </>
  );
};

// export const Token = () => {
//   const param = useParams();
//   const nav = useNavigate();
//   console.log(param);
//   if (param.t) {
//     localStorage.setItem("pointlessToken", param.t);
//     nav("/");
//   }
//   return (<><p>Test</p><p>{param.t}</p></>);
// }

// export const HandleParams = () => {
//   const param = useParams();
//   const nav = useNavigate();
//   console.log(param);
//   if (param.t) {
//     localStorage.setItem("pointlessToken", param.t);
//     nav("/");
//   }
//   useEffect(() => {
//     console.log(param);
//     if (param.t) {
//       localStorage.setItem("pointlessToken", param.t);
//       nav("/");
//     }
//   }, []);
//   return (<><p>Test</p><p>{param.t}</p></>);
// };

export default MainPage;
