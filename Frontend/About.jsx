import React from "react";
import Header from "../src/components/layout/Header";
import Footer from "../src/components/layout/Footer";
import AboutVideo from "./AboutVideo";

const About = () => {
  return (
    <>
    <Header/>
      <AboutVideo/>
      <main className="about glass lift">
        <div className="about-container">
          <h1>About Our Facility Booking System</h1>
          <p>
            The SJCE Campus Facility Booking System is a modern platform designed
            to simplify and digitalize the process of booking auditoriums, labs,
            and other campus facilities. With real-time availability, AI-powered
            scheduling, and role-based access, it ensures a seamless experience
            for students, faculty, and administrators.
          </p>

          <section className="about-grid">
            <div className="about-card">
              <h3>🎯 Mission</h3>
              <p>
                To provide a streamlined, transparent, and efficient booking
                process for all campus facilities.
              </p>
            </div>
            <div className="about-card">
              <h3>🚀 Features</h3>
              <p>
                Real-time booking, AI-based suggestions, admin approvals,
                notifications, and conflict-free scheduling.
              </p>
            </div>
            <div className="about-card">
              <h3>🤝 Users</h3>
              <p>
                Designed for students, faculty, HODs, and administrators with
                secure role-based access.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />

      <style>{`
        /* Page wrapper */
        body {
          margin: 0;
          font-family: 'Segoe UI', Roboto, sans-serif;
          background: radial-gradient(circle at top left, #0a0f1e, #10182f);
          color: #fff;
        }

        main.about {
          min-height: 75vh; /* not too scrollable */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
        }

        .about-container {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
          padding: 40px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          transition: transform .3s;
        }

        .about-container:hover {
          transform: translateY(-5px);
        }

        h1 {
          font-size: 2.2rem;
          margin-bottom: 20px;
          font-weight: 700;
          color: #e0e0e0;
        }

        p {
          font-size: 1rem;
          line-height: 1.6;
          color: #ccc;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .about-card {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .about-card:hover {
          background: rgba(108, 92, 231, 0.15);
          transform: translateY(-6px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .about-card h3 {
          margin-bottom: 10px;
          font-size: 1.3rem;
          color: #fff;
        }

        .about-card p {
          color: #d0d0d0;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .about-container {
            padding: 30px 20px;
          }
          h1 {
            font-size: 1.8rem;
          }
          .about-card {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default About;
