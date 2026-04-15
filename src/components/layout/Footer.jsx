import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="site-footer__grid">
          <div>
            <p className="site-footer__eyebrow">SJCE Smart Operations</p>
            <h3>AI-Integrated Campus Facility Booking System</h3>
            <p>
              Built to reduce double bookings, speed up approvals, and give students,
              faculty, and admins a single professional booking platform.
            </p>
          </div>
          <div>
            <h4>Core Features</h4>
            <p>Purpose-based facility suggestions</p>
            <p>Real-time availability and conflict detection</p>
            <p>Email and SMS reminder-ready workflows</p>
          </div>
          <div>
            <h4>Campus Contact</h4>
            <p>booking@sjce.ac.in</p>
            <p>+91 8262 123456</p>
            <p>St. Joseph&apos;s College of Engineering</p>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>{currentYear} SJCE</span>
          <span>Professional booking, approvals, analytics, and reminders in one flow.</span>
        </div>
      </footer>

      <style>{`
        .site-footer {
          margin: 2rem 1rem 1rem;
          padding: 1.5rem;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, rgba(6, 22, 34, 0.92), rgba(3, 14, 24, 0.95));
          color: #e8f4f6;
        }
        .site-footer__grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr;
          gap: 1.2rem;
        }
        .site-footer__eyebrow {
          margin: 0;
          color: #8fe3cf;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.76rem;
        }
        .site-footer h3,
        .site-footer h4 {
          margin: 0.5rem 0 0.8rem;
        }
        .site-footer p,
        .site-footer__bottom {
          color: rgba(219, 233, 236, 0.74);
          line-height: 1.7;
        }
        .site-footer__bottom {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.92rem;
        }
        @media (max-width: 860px) {
          .site-footer__grid,
          .site-footer__bottom {
            grid-template-columns: 1fr;
            display: grid;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
