import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import videoSource from "../src/assets/l.mp4";
import { AuthContext } from "../src/App";
import Header from "./Header";
import axios from "axios";

const COLORS = {
  primary: "#4F46E5",
  secondary: "#6366F1",
  background: "#0F172A",
  surface: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.15)",
  textPrimary: "#F1F5F9",
  textSecondary: "#CBD5E1",
  iconBg: "rgba(255, 255, 255, 0.12)",
};

const Login = () => {


  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [signupIdentifier, setSignupIdentifier] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const { setIsLoggedIn } = useContext(AuthContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // const handleSignup = (e) => {
  //   e.preventDefault();
  //   setError("");
  //   if (!signupIdentifier || !signupPassword || !signupConfirmPassword) {
  //     setError("Please fill in all fields.");
  //     return;
  //   }
  //   if (signupPassword !== signupConfirmPassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }
  //   if (signupPassword.length < 6) {
  //     setError("Password must be at least 6 characters.");
  //     return;
  //   }
  //   const users = JSON.parse(localStorage.getItem("users")) || [];
  //   const userExists = users.some((u) => u.identifier === signupIdentifier);
  //   if (userExists) {
  //     setError("User already exists.");
  //     return;
  //   }
  //   const newUser = {
  //     identifier: signupIdentifier,
  //     password: signupPassword,
  //     role,
  //   };
  //   localStorage.setItem("users", JSON.stringify([...users, newUser]));
  //   setIsSignup(false);
  //   setSignupIdentifier("");
  //   setSignupPassword("");
  //   setSignupConfirmPassword("");
  //   alert("Account created successfully. Please log in.");
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          token,
          role: user.role,
          id: user.id,
          department: user.department,
        })
      );

      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      // Redirect based on role
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "HOD") navigate("/hod");
      else if (user.role === "Faculty") navigate("/staff");
      else navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };


  return (
    <StyledWrapper style={bodyStyle}>
      <Header />
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <video
          ref={videoRef}
          src={videoSource}
          muted
          playsInline
          autoPlay
          loop
          style={videoStyle}
        />
        <div style={videoOverlay} />
        <div style={videoTextContainer}>
          <h1 style={videoHeroTitle}>Create Your Account / Sign In</h1>
          <p style={videoHeroDesc}>
            AI-powered scheduling that eliminates conflicts, optimizes space
            usage, and delivers seamless booking experiences for your entire
            campus community.
          </p>
        </div>
      </div>

      <div className="main-content">
        {role ? (
          <div className="auth-form" style={glassCardStyle}>
            {forgotPassword ? (
              <>
                <h2 className="form-title">Forgot Password</h2>
                <p className="form-subtitle">
                  Enter your registered email or roll number to reset your
                  password.
                </p>
                <form className="form">
                  <div className="flex-column">
                    <label>Email or Roll No</label>
                    <div className="inputForm">
                      <input
                        type="text"
                        className="input"
                        placeholder="Enter your Email or Roll No"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                      />
                    </div>
                  </div>
                  {error && <p className="error-text">{error}</p>}
                  <button type="button" className="button-submit">
                    Reset Password
                  </button>
                  <button
                    type="button"
                    className="btn-secondary back-btn"
                    onClick={() => setForgotPassword(false)}
                  >
                    Back
                  </button>
                </form>
              </>
            ) : isSignup ? (
              <>
                <h2 className="form-title">{role} Sign Up</h2>
                <form onSubmit={handleSignup} className="form">
                  <div className="flex-column">
                    <label>{role === "Student" ? "Roll No" : "Email"}</label>
                    <div className="inputForm">
                      <input
                        type="text"
                        className="input"
                        placeholder={role === "Student" ? "Enter your Roll No" : "Enter your Email"}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />

                    </div>
                  </div>
                  <div className="flex-column">
                    <label>Password</label>
                    <div className="inputForm">
                      <input
                        type="password"
                        className="input"
                        placeholder="Enter your Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-column">
                    <label>Confirm Password</label>
                    <div className="inputForm">
                      <input
                        type="password"
                        className="input"
                        placeholder="Confirm Password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <p className="error-text">{error}</p>}
                  <button type="submit" className="button-submit">
                    Create Account
                  </button>
                  <button
                    type="button"
                    className="btn-secondary back-btn"
                    onClick={() => setIsSignup(false)}
                  >
                    Back
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="form-title">{role} Sign In</h2>
                <form onSubmit={handleLogin} className="form">
                  <div className="flex-column">
                    <label>{role === "Student" ? "Roll No" : "Email"}</label>
                    <div className="inputForm">
                      <input
                        type="text"
                        className="input"
                        placeholder={
                          role === "Student"
                            ? "Enter your Roll No"
                            : "Enter your Email"
                        }
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-column">
                    <label>Password</label>
                    <div className="inputForm">
                      <input
                        type="password"
                        className="input"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <p className="error-text">{error}</p>}
                  <div className="flex-row">
                    <div>
                      <input type="checkbox" id="rememberMe" />
                      <label htmlFor="rememberMe">Remember me</label>
                    </div>
                    <button
                      type="button"
                      className="span"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" className="button-submit">
                    Sign In
                  </button>
                  <p className="p">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      className="span"
                      onClick={() => setIsSignup(true)}
                    >
                      Sign Up
                    </button>
                  </p>
                  <p className="p line">Or With</p>
                  <div className="flex-row">
                    <button type="button" className="btn google">
                      Google
                    </button>
                    <button type="button" className="btn apple">
                      Apple
                    </button>
                  </div>
                  <button
                    className="btn-secondary back-btn"
                    type="button"
                    onClick={() => setRole(null)}
                  >
                    Back
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div className="role-access" style={glassCardStyle}>
            <h2>Select Your Role</h2>
            <button onClick={() => setRole("Faculty")} style={roleButtonStyle}>
              Faculty
            </button>
            <button onClick={() => setRole("HOD")} style={roleButtonStyle}>
              HOD
            </button>
            <button onClick={() => setRole("Admin")} style={roleButtonStyle}>
              Admin
            </button>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .flex-column {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .flex-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .inputForm {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 10px 12px;
          gap: 10px;
        }
        .input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          color:black;
          font-size: 1rem;
        }
        .button-submit {
          background: ${COLORS.primary};
          color: white;
          padding: 12px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: background 0.3s ease;
        }
        .button-submit:hover {
          background: ${COLORS.secondary};
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid ${COLORS.border};
          color: ${COLORS.textSecondary};
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
        }
        .back-btn {
          margin-top: 12px;
        }
        .form-title {
          font-size: 1.8rem;
          margin-bottom: 12px;
          font-weight: bold;
        }
        .form-subtitle {
          font-size: 0.95rem;
          margin-bottom: 20px;
          color: ${COLORS.textSecondary};
        }
        .error-text {
          color: red;
          font-size: 0.9rem;
          margin: 0;
        }
        .p {
          font-size: 0.95rem;
          color: ${COLORS.textSecondary};
        }
        .span {
          background: none;
          border: none;
          color: ${COLORS.primary};
          font-weight: 600;
          cursor: pointer;
        }
        .line {
          text-align: center;
          margin: 12px 0;
          position: relative;
        }
        .line::before, .line::after {
          content: "";
          position: absolute;
          width: 40%;
          height: 1px;
          background: ${COLORS.border};
          top: 50%;
        }
        .line::before {
          left: 0;
        }
        .line::after {
          right: 0;
        }
        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid ${COLORS.border};
          background: ${COLORS.primary};
          color: ${COLORS.textPrimary};
          font-weight: 600;
          cursor: pointer;
        }
        .btn.google {
          margin-right: 8px;
        }
        .btn.apple {
          margin-left: 8px;
        }
      `}</style>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const bodyStyle = {
  background: COLORS.background,
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
  margin: 0,
};

const videoStyle = {
  width: "100%",
  height: "80%",
  objectFit: "cover",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 1,
};

const roleButtonStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(5px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  padding: "12px 24px",
  color: COLORS.textPrimary,
  margin: "10px",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const videoOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "80%",
  background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7))",
  zIndex: 2,
};

const glassCardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
  borderRadius: "16px",
  padding: "40px",
  color: COLORS.textPrimary,
  textAlign: "center",
  maxWidth: "580px",
  margin: "0 auto",
};

const videoTextContainer = {
  position: "relative",
  zIndex: 3,
  textAlign: "center",
  color: "white",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "0 20px",
};

const videoHeroTitle = {
  fontSize: "3.5rem",
  fontWeight: "800",
  marginBottom: "20px",
  textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
  color: COLORS.textPrimary,
};

const videoHeroDesc = {
  fontSize: "1.2rem",
  maxWidth: "800px",
  margin: "0 auto 40px",
  color: COLORS.textSecondary,
  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
};

export default Login;
