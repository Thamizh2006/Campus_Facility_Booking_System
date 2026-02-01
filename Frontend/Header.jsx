import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "./images/sjce_logo.png";
import { AuthContext } from "../src/App";
import Logout from "./Logout";

const Header = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <header className="header glass lift">
        <div className="brand">
          <img src={logo} alt="SJCE Logo" className="logo" />
          <div className="title">SJCE CAMPUS FACILITY BOOKING SYSTEM</div>
        </div>
        <nav className="nav">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>

          <div className="dropdown">
            <span className="dropbtn">Booking ▾</span>
            <div className="dropdown-content">
              <Link to="/booking">Booking</Link>
              <Link to="/bookinghistory">Booked History</Link>
              <Link to="/accepted">Accepted Slots</Link>
              <Link to="/rejected">Rejected Slots</Link>
            </div>
          </div>

          {isLoggedIn ? <Logout /> : <Link to="/login">Login</Link>}
        </nav>
      </header>

      <style>{`
        /* Global Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: var(--background, #0a0f1e);
          color: var(--text, #fff);
        }

        /* Header */
        .header { 
          position: sticky; 
          top: 0; 
          z-index: 50; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 14px 28px; 
          width: 99%;
          background: rgba(10,15,30,0.6); 
          box-sizing: border-box;
        }
        .brand { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .logo { 
          width: 42px; 
          height: 42px; 
          object-fit: contain; 
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); 
        }
        .title { 
          font-weight: 800; 
          letter-spacing: .3px; 
          font-size: clamp(14px, 2.5vw, 18px); 
        }
        .nav { 
          display: flex; 
          align-items: center; 
          gap: 18px; 
        }
        .nav a, .dropbtn { 
          padding: 8px 12px; 
          border-radius: 10px; 
          color: var(--text2, #ccc); 
          transition: background .2s; 
          text-decoration: none;
          cursor: pointer;
        }
        .nav a:hover, .dropbtn:hover { 
          background: rgba(255,255,255,0.06); 
          color: var(--text, #fff); 
        }
        .nav .active { 
          background: rgba(108,92,231,0.2); 
          color: white; 
        }

        /* Dropdown */
        .dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background: rgba(20, 25, 45, 0.95);
          min-width: 180px;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.4);
          z-index: 100;
        }
        .dropdown-content a {
          display: block;
          padding: 10px 14px;
          color: var(--text2, #ccc);
          text-decoration: none;
          border-radius: 6px;
        }
        .dropdown-content a:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </>
  );
};

export default Header;
