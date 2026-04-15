import React, { useContext, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/sjce_logo.png";
import { AuthContext } from "../../App";
import Logout from "./Logout";

const Header = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const quickLinks = useMemo(
    () => [
      { to: "/home", label: "Home" },
      { to: "/about", label: "About" },
      ...(isLoggedIn
        ? [
            { to: "/booking", label: "Smart Booking" },
            { to: "/bookinghistory", label: "Requests & History" },
          ]
        : [{ to: "/login", label: "Login" }]),
    ],
    [isLoggedIn]
  );

  return (
    <>
      <header className="topbar">
        <Link to="/home" className="brandmark">
          <img src={logo} alt="SJCE Logo" className="brandmark__logo" />
          <div>
            <p className="brandmark__eyebrow">St. Joseph&apos;s College of Engineering</p>
            <h1 className="brandmark__title">AI Campus Facility Booking</h1>
          </div>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <div className={`topbar__right ${menuOpen ? "open" : ""}`}>
          <nav className="topbar__nav">
            {quickLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__actions">
            {isLoggedIn ? (
              <div className="user-chip">
                <span>{user?.role || "User"}</span>
                <strong>{user?.name || user?.email || user?.rollno || "SJCE account"}</strong>
              </div>
            ) : null}
            {isLoggedIn ? <Logout /> : null}
          </div>
        </div>
      </header>

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.2rem;
          padding: 1rem 1.25rem;
          margin: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(6, 26, 41, 0.9), rgba(12, 50, 64, 0.85)),
            rgba(6, 17, 31, 0.88);
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 60px rgba(2, 12, 24, 0.32);
        }
        .brandmark {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          color: inherit;
          text-decoration: none;
          min-width: 0;
        }
        .brandmark__logo {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.4rem;
        }
        .brandmark__eyebrow {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(215, 229, 233, 0.72);
        }
        .brandmark__title {
          margin: 0.15rem 0 0;
          font-size: 1rem;
          font-family: "Poppins", "Segoe UI", sans-serif;
          color: #f7fcfd;
        }
        .menu-toggle {
          display: none;
          border: 0;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          color: #f7fcfd;
          background: rgba(255, 255, 255, 0.08);
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .topbar__nav {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .nav-link {
          padding: 0.8rem 1rem;
          border-radius: 999px;
          color: rgba(230, 243, 246, 0.78);
          text-decoration: none;
          transition: 0.2s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .topbar__actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-chip {
          display: flex;
          flex-direction: column;
          padding: 0.7rem 0.9rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(224, 237, 240, 0.88);
          line-height: 1.1;
        }
        .user-chip span {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.75;
        }
        .user-chip strong {
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        .logout-button {
          border: 0;
          padding: 0.85rem 1.2rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316, #ef4444);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        @media (max-width: 980px) {
          .menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .topbar__right {
            position: absolute;
            top: calc(100% + 0.5rem);
            left: 0;
            right: 0;
            margin: 0 1rem;
            padding: 1rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: rgba(6, 17, 31, 0.98);
            flex-direction: column;
            align-items: stretch;
            display: none;
          }
          .topbar__right.open {
            display: flex;
          }
          .topbar__nav,
          .topbar__actions {
            flex-direction: column;
            align-items: stretch;
          }
          .user-chip {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
