import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume, faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FaCalendarAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "black",
        color: "white",
        padding: "2rem",
        height:"400px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Section 1: App Info */}
        <div style={{ flex: "1 1 250px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <FaCalendarAlt
              style={{
                fontSize: "2rem",
                padding: "0.5rem",
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                borderRadius: "1rem",
                marginRight: "0.75rem",
              }}
            />
            <div>
              <h3 style={{ margin: 0 }}>SJCE</h3>
              <p style={{ fontSize: "0.9rem", color: "#aaa", marginTop: "4px" }}>
                Event Booking
              </p>
            </div>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#ccc" }}>
            Smart, AI-powered facility booking system designed to streamline campus operations and enhance user experience.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div style={{ flex: "1 1 150px" }}>
          <h4 style={{ marginBottom: "1rem", color: "#eee" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li><a href="#home" style={{ color: "#ccc", textDecoration: "none" }}>Home</a></li>
            <li><a href="#booking" style={{ color: "#ccc", textDecoration: "none" }}>Booking</a></li>
            <li><a href="#about" style={{ color: "#ccc", textDecoration: "none" }}>About</a></li>
            <li><a href="#contact" style={{ color: "#ccc", textDecoration: "none" }}>Contact</a></li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div style={{ flex: "1 1 200px" }}>
          <h4 style={{ marginBottom: "1rem", color: "#eee" }}>Contact</h4>
          <div style={{ lineHeight: "2", color: "#ccc" }}>
            <p>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: "#0cf", marginRight: "10px" }} />
              booking@sjce.ac.in
            </p>
            <p>
              <FontAwesomeIcon icon={faPhoneVolume} style={{ color: "#b677ff", marginRight: "10px" }} />
              +91 8262 123456
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} style={{ color: "#f97316", marginRight: "10px" }} />
              SJCE Campus, Mysuru
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "#666" }}>
        &copy; {currentYear} SJCE — All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
