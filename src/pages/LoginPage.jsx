import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../App";
import { apiRequest } from "../lib/api";

const ROLES = ["Faculty", "HOD", "Admin", "Student"];

const EMPTY_SIGNIN = {
  identifier: "",
  password: "",
};

const EMPTY_SIGNUP = {
  name: "",
  role: "Faculty",
  email: "",
  rollno: "",
  department: "",
  password: "",
  confirmPassword: "",
};

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const [signin, setSignin] = useState(EMPTY_SIGNIN);
  const [signup, setSignup] = useState(EMPTY_SIGNUP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const isStudentSignup = useMemo(() => signup.role === "Student", [signup.role]);

  const updateSignin = (event) => {
    const { name, value } = event.target;
    setSignin((current) => ({ ...current, [name]: value }));
  };

  const updateSignup = (event) => {
    const { name, value } = event.target;
    setSignup((current) => ({ ...current, [name]: value }));
  };

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  const handleSignin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          email: signin.identifier,
          password: signin.password,
        }),
      });

      setUser({
        token: response.token,
        id: response.user.id,
        role: response.user.role,
        name: response.user.name,
        department: response.user.department,
        email: response.user.email,
        rollno: response.user.rollno,
      });

      navigate(location.state?.from || "/booking", { replace: true });
    } catch (error) {
      showMessage("error", error.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (signup.password !== signup.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const payload = {
        name: signup.name,
        role: signup.role,
        email: signup.email || undefined,
        rollno: signup.rollno || undefined,
        department: signup.department || undefined,
        password: signup.password,
      };

      const response = await apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      showMessage("success", response.message || "Account created successfully");
      setSignup(EMPTY_SIGNUP);
      setMode("signin");
    } catch (error) {
      showMessage("error", error.message || "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <Header />

      <main className="auth-hero">
        <section className="auth-copy">
          <p className="auth-eyebrow">Secure campus access</p>
          <h1>Sign in or create an account to manage campus facility bookings.</h1>
          <p className="auth-description">
            Faculty, HODs, admins, and students can register, log in, submit requests,
            track approvals, and manage booking history from one place.
          </p>

          <div className="auth-highlights">
            <div className="highlight-card">
              <strong>Role-based access</strong>
              <span>Students and staff each get the right booking permissions.</span>
            </div>
            <div className="highlight-card">
              <strong>Conflict-safe scheduling</strong>
              <span>Live availability and smart alternate slots are built in.</span>
            </div>
            <div className="highlight-card">
              <strong>Admin-ready workflow</strong>
              <span>Approvals, status tracking, reminders, and records stay connected.</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "signin" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {mode === "signin" ? (
            <form className="auth-form" onSubmit={handleSignin}>
              <div className="auth-card__header">
                <p>Existing users</p>
                <h2>Welcome back</h2>
              </div>

              <label>
                Email or roll number
                <input
                  type="text"
                  name="identifier"
                  value={signin.identifier}
                  onChange={updateSignin}
                  placeholder="faculty@sjce.edu or 23IT102"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={signin.password}
                  onChange={updateSignin}
                  placeholder="Enter your password"
                  required
                />
              </label>

              {message ? <p className={messageType === "success" ? "form-message success" : "form-message error"}>{message}</p> : null}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <div className="auth-card__header">
                <p>New account</p>
                <h2>Create access</h2>
              </div>

              <label>
                Full name
                <input
                  type="text"
                  name="name"
                  value={signup.name}
                  onChange={updateSignup}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Role
                <select name="role" value={signup.role} onChange={updateSignup}>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              {isStudentSignup ? (
                <label>
                  Roll number
                  <input
                    type="text"
                    name="rollno"
                    value={signup.rollno}
                    onChange={updateSignup}
                    placeholder="23IT102"
                    required
                  />
                </label>
              ) : (
                <label>
                  College email
                  <input
                    type="email"
                    name="email"
                    value={signup.email}
                    onChange={updateSignup}
                    placeholder="faculty@sjce.edu"
                    required
                  />
                </label>
              )}

              <label>
                Department
                <input
                  type="text"
                  name="department"
                  value={signup.department}
                  onChange={updateSignup}
                  placeholder="CSE / IT / ECE"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={signup.password}
                  onChange={updateSignup}
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>

              <label>
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  value={signup.confirmPassword}
                  onChange={updateSignup}
                  placeholder="Re-enter password"
                  required
                />
              </label>

              {message ? <p className={messageType === "success" ? "form-message success" : "form-message error"}>{message}</p> : null}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        .auth-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 30%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.2), transparent 28%),
            linear-gradient(180deg, #05131f 0%, #071d2b 100%);
          color: #ecf8fb;
        }
        .auth-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1.25rem 5rem;
          align-items: start;
        }
        .auth-copy h1 {
          margin: 0.6rem 0 1rem;
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 0.98;
          font-family: "Poppins", "Segoe UI", sans-serif;
        }
        .auth-eyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #8fe3cf;
          font-size: 0.8rem;
        }
        .auth-description {
          max-width: 640px;
          color: rgba(225, 239, 242, 0.82);
          font-size: 1.08rem;
          line-height: 1.7;
        }
        .auth-highlights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .highlight-card,
        .auth-card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 60px rgba(2, 12, 24, 0.28);
        }
        .highlight-card {
          padding: 1rem;
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .highlight-card strong {
          font-size: 1rem;
        }
        .highlight-card span {
          color: rgba(224, 236, 239, 0.72);
          line-height: 1.5;
        }
        .auth-card {
          padding: 1.6rem;
          border-radius: 30px;
        }
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .auth-tab {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 16px;
          padding: 0.9rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: #dcebed;
          cursor: pointer;
          font-weight: 700;
        }
        .auth-tab.active {
          background: linear-gradient(135deg, #14b8a6, #0ea5e9);
          color: white;
          border-color: transparent;
        }
        .auth-card__header p {
          margin: 0;
          color: #8fe3cf;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
        }
        .auth-card__header h2 {
          margin: 0.4rem 0 0;
          font-size: 2rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-form label {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          color: rgba(232, 242, 244, 0.85);
          font-weight: 600;
        }
        .auth-form input,
        .auth-form select {
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 0.95rem 1rem;
          background: rgba(6, 24, 36, 0.75);
          color: white;
          outline: none;
        }
        .auth-form input:focus,
        .auth-form select:focus {
          border-color: rgba(20, 184, 166, 0.85);
          box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
        }
        .submit-button {
          border: 0;
          border-radius: 18px;
          padding: 1rem 1.1rem;
          background: linear-gradient(135deg, #14b8a6, #0ea5e9);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: progress;
        }
        .form-message {
          margin: 0;
          padding: 0.8rem 0.9rem;
          border-radius: 16px;
          font-weight: 600;
        }
        .form-message.success {
          background: rgba(34, 197, 94, 0.14);
          color: #bbf7d0;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .form-message.error {
          color: #fecaca;
          background: rgba(239, 68, 68, 0.14);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        @media (max-width: 980px) {
          .auth-hero {
            grid-template-columns: 1fr;
          }
          .auth-highlights {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
