// Booking.jsx
import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slide1 from "./images/bookingimg1.jpeg";
import slide2 from "./images/bookingimg2.jpg";
import slide3 from "./images/bookingimg3.jpg";
import slide4 from "./images/bookingimg4.jpeg";
import videoSource from "../src/assets/BOOKHERE.mp4";

import { AuthContext } from "../src/App";
import Footer from "./Footer";
import Header from "./Header";




const COLORS = {
  primary: "#6C5CE7",
  secondary: "#8E7CF6",
  background: "#0B1220",
  surface: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.18)",
  textPrimary: "#E6EEF8",
  textSecondary: "#C0C8D8",
  success: "#14b8a6",
  danger: "#ef4444",
  warning: "#f59e0b",
};

const FACILITIES = [
  {
    id: "av_hall",
    name: "AV Hall",
    admins: [{ name: "AV In-Charge", email: "av-incharge@sjce.edu" }],
    supports: {
      mic: { type: "qty", max: 6 },
      lights: { type: "bool" },
      chairs: { type: "qty", max: 250 },
      vipChairs: { type: "qty", max: 20 },
      speakers: { type: "qty", max: 4 },
      ac: { type: "bool" },
      projector: { type: "bool" },
      waterBottle: { type: "qty", max: 400 },
      snacks: { type: "bool" },
    },
    allowedEvents: [
      "Seminar",
      "Orientation",
      "Cultural Event",
      "Guest Lecture",
      "Club Meet",
    ],
  },
  {
    id: "auditorium",
    name: "Indoor Auditorium",
    admins: [{ name: "Auditorium In-Charge", email: "auditorium@sjce.edu" }],
    supports: {
      mic: { type: "qty", max: 10 },
      lights: { type: "bool" },
      chairs: { type: "qty", max: 800 },
      vipChairs: { type: "qty", max: 40 },
      speakers: { type: "qty", max: 8 },
      ac: { type: "bool" },
      projector: { type: "bool" },
      waterBottle: { type: "qty", max: 1000 },
      snacks: { type: "bool" },
    },
    allowedEvents: ["Cultural Event", "Annual Day", "Conference", "Seminar"],
  },
  {
    id: "conference_hall",
    name: "Conference Hall",
    admins: [{ name: "Conference In-Charge", email: "conference@sjce.edu" }],
    supports: {
      mic: { type: "qty", max: 4 },
      lights: { type: "bool" },
      chairs: { type: "qty", max: 80 },
      vipChairs: { type: "qty", max: 10 },
      speakers: { type: "qty", max: 2 },
      ac: { type: "bool" },
      projector: { type: "bool" },
      waterBottle: { type: "qty", max: 150 },
      snacks: { type: "bool" },
    },
    allowedEvents: ["Meeting", "Workshop", "Review", "Seminar"],
  },
  {
    id: "computer_lab",
    name: "Computer Lab",
    admins: [{ name: "Lab In-Charge", email: "comp-lab@sjce.edu" }],
    supports: {
      mic: { type: "qty", max: 2 },
      lights: { type: "bool" },
      chairs: { type: "qty", max: 60 },
      vipChairs: { type: "qty", max: 5 },
      speakers: { type: "qty", max: 2 },
      ac: { type: "bool" },
      projector: { type: "bool" },
      waterBottle: { type: "qty", max: 120 },
      snacks: { type: "bool" },
    },
    allowedEvents: ["Workshop", "Hands-on", "Lab Test"],
  },
  {
    id: "library",
    name: "Library",
    admins: [{ name: "Librarian", email: "library@sjce.edu" }],
    supports: {
      mic: { type: "qty", max: 1 },
      lights: { type: "bool" },
      chairs: { type: "qty", max: 40 },
      vipChairs: { type: "qty", max: 5 },
      speakers: { type: "qty", max: 1 },
      ac: { type: "bool" },
      projector: { type: "bool" },
      waterBottle: { type: "qty", max: 80 },
      snacks: { type: "bool" },
    },
    allowedEvents: ["Orientation", "Book Talk", "Workshop"],
  },
];

const EVENT_TYPES = [
  "Seminar",
  "Workshop",
  "Conference",
  "Cultural Event",
  "Orientation",
  "Guest Lecture",
  "Club Meet",
  "Meeting",
  "Review",
  "Hands-on",
  "Lab Test",
  "Annual Day",
];

// ---------------------- HELPERS ----------------------
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const toInputDate = (d) => {
  // YYYY-MM-DD for input[type="date"]
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const todayIST = () => {
  // Force IST for safety: UTC+5:30
  const now = new Date();
  // This is fine for client-side; server should use robust TZ handling.
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// ---------------------- COMPONENT ----------------------
const Booking = () => {
  const { isLoggedIn ,user } = useContext(AuthContext);
  useEffect(() => {
  if (!isLoggedIn) {
    alert("Please login to access booking");
    navigate("/login");
  }
}, [isLoggedIn, navigate]);

  const navigate = useNavigate();
  const videoRef = useRef(null);

  const images = [slide1, slide2, slide3, slide4];
  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 600,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2200,
      arrows: false,
      pauseOnHover: true,
      adaptiveHeight: true,
    }),
    []
  );

  // ---------- Booking Form State ----------
  const [eventType, setEventType] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
const [name, setName] = useState(user?.username || "");
const [department, setDepartment] = useState(user?.department || "");
const [email, setEmail] = useState(user?.email || "");

const [contact, setContact] = useState("");
const [organizer, setOrganizer] = useState("");


  const [resources, setResources] = useState({
    mic: 0,
    lights: false,
    chairs: 0,
    vipChairs: 0,
    speakers: 0,
    ac: false,
    projector: false,
    waterBottle: 0,
    snacks: false,
  });
  const [queries, setQueries] = useState("");
  const [errors, setErrors] = useState({});
  const [submitMsg, setSubmitMsg] = useState(null);

  const minDate = useMemo(() => toInputDate(addDays(todayIST(), 7)), []);

  const selectedFacility = useMemo(
    () => FACILITIES.find((f) => f.id === facilityId) || null,
    [facilityId]
  );

  const eligibleFacilities = useMemo(() => {
    if (!eventType) return [];
    return FACILITIES.filter((f) => f.allowedEvents.includes(eventType));
  }, [eventType]);

  const approveBooking = async (id) => {
  await fetch(`http://localhost:8080/api/bookings/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  fetchBookings();
};

const rejectBooking = async (id, reason) => {
  await fetch(`http://localhost:8080/api/bookings/${id}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({ reason }),
  });
  fetchBookings();
};


  // Reset facility & resources when event changes
  useEffect(() => {
    setFacilityId("");
    setResources({
      mic: 0,
      lights: false,
      chairs: 0,
      vipChairs: 0,
      speakers: 0,
      ac: false,
      projector: false,
      waterBottle: 0,
      snacks: false,
    });
  }, [eventType]);

  // Reset resources when facility changes
  useEffect(() => {
    if (!selectedFacility) return;
    const base = {};
    Object.entries(selectedFacility.supports).forEach(([key, spec]) => {
      if (spec.type === "bool") base[key] = false;
      if (spec.type === "qty") base[key] = 0;
    });
    setResources((r) => ({ ...base }));
  }, [selectedFacility]);

  // ---------- Validation ----------
  const validate = () => {
    const newErr = {};
    if (!eventType) newErr.eventType = "Please select an event type.";
    if (!facilityId) newErr.facilityId = "Please select a facility.";
    if (!eventDate) newErr.eventDate = "Please choose an event date.";

    if (eventDate) {
      const chosen = new Date(eventDate);
      const min = new Date(minDate);
      if (chosen < min) {
        newErr.eventDate = "Bookings must be made at least 7 days in advance.";
      }
    }
    if (!timeFrom || !timeTo) newErr.time = "Please select start and end time.";
    if (timeFrom && timeTo && timeFrom >= timeTo) {
      newErr.time = "End time must be later than start time.";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

// Booking.jsx — replace your handleSubmit with this
// Booking.jsx — updated handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    name,
    department,
    contact,
    email,
    organizer,
    purpose: eventType,
    facility: selectedFacility?.name,
    date: eventDate,
    starttime: timeFrom,
    endtime: timeTo,
    resources,
    queries,
  };

  try {
   const res = await fetch("http://localhost:8080/av/requestbooking", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
  body: JSON.stringify(payload),
});


    const data = await res.json();

    if (res.ok) {
      setSubmitMsg({ type: "success", text: data.message || "Booking successful!" });
      navigate("/bookinghistory");
    } else {
      setSubmitMsg({ type: "error", text: data.message || "Booking failed!" });
    }
  } catch (err) {
    console.error("Booking error:", err);
    setSubmitMsg({ type: "error", text: "Server error. Try again." });
  }
};




  // ---------- UI Helpers ----------
  const renderResourceControl = (key, spec) => {
    const labelMap = {
      mic: "Mic",
      lights: "Lights",
      chairs: "Chairs",
      vipChairs: "VIP Chairs",
      speakers: "Speakers",
      ac: "AC",
      projector: "Projector",
      waterBottle: "Water Bottles",
      snacks: "Snacks",
    };

    const unavailable = !selectedFacility || !selectedFacility.supports[key];

    if (spec.type === "bool") {
      return (
        <label className={`res-item ${unavailable ? "disabled" : ""}`}>
          <input
            type="checkbox"
            disabled={unavailable}
            checked={!!resources[key]}
            onChange={(e) =>
              setResources((r) => ({ ...r, [key]: e.target.checked }))
            }
          />
          <span>{labelMap[key]}</span>
        </label>
      );
    }

    if (spec.type === "qty") {
      const max = spec.max ?? 0;
      return (
        <label className={`res-item qty ${unavailable ? "disabled" : ""}`}>
          <span>{labelMap[key]}</span>
          <input
            type="number"
            min={0}
            max={max}
            step={1}
            placeholder={`0 / ${max}`}
            disabled={unavailable}
            value={Number(resources[key] || 0)}
            onChange={(e) => {
              const v = Math.max(0, Math.min(max, Number(e.target.value)));
              setResources((r) => ({ ...r, [key]: v }));
            }}
          />
          <span className="hint">Max {max}</span>
        </label>
      );
    }

    return null;
  };



  

  return (
    <div className="page-root">
      <style>{CSS}</style>

      <Header />

      {/* Hero Video */}
      <section className="hero">
        <video
          ref={videoRef}
          src={videoSource}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="hero-video"
        />
        <div className="hero-overlay" />
        <div className="hero-content fade-up">
          <h1>Smart Campus Facility Booking</h1>
          <p>
            AI-powered scheduling that eliminates conflicts, optimizes space
            usage, and delivers seamless booking experiences for your entire
            campus community.
          </p>
          <a href="#book" className="cta-button glow">
            Book Now
          </a>
        </div>
       
      </section>

      {/* Intro Card */}
      <section className="intro">
        <div className="card glass lift">
          <h2>🔖 Book Campus Facilities Smarter with AI</h2>
          <p>
            Easily book auditoriums, labs, seminar halls, and more using
            real-time AI suggestions and live availability. Fast, paperless, and
            campus-optimized.
          </p>
          <p>
            No conflicts, smart notifications, and admin-friendly approvals —
            everything in one place.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery">
        <Slider {...sliderSettings}>
          {images.map((img, idx) => (
            <div key={idx} className="slide">
              <img src={img} alt={`Slide ${idx + 1}`} />
            </div>
          ))}
        </Slider>
      </section>

      {/* Booking Form */}
      <section id="book" className="form-wrap">
  <div className="card glass lift fade-up">
    <div className="form-head">
      <h3>Request a Facility</h3>
      <p>
        Bookings must be made at least <strong>7 days</strong> in advance.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="grid">
      {/* Name */}
      <div className="field">
        <label>
          Name <span className="req">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Department */}
      <div className="field">
        <label>
          Department <span className="req">*</span>
        </label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>

      {/* Contact Number */}
      <div className="field">
        <label>
          Contact No <span className="req">*</span>
        </label>
        <input
          type="tel"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className="field">
        <label>
          Email <span className="req">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Organizer */}
      <div className="field">
        <label>
          Organizer <span className="req">*</span>
        </label>
        <input
          type="text"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          required
        />
      </div>

      {/* Event Type */}
      <div className="field">
        <label>
          Event Type <span className="req">*</span>
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className={errors.eventType ? "error" : ""}
        >
          <option value="">Select an event</option>
          {EVENT_TYPES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        {errors.eventType && (
          <small className="error-text">{errors.eventType}</small>
        )}
      </div>

      {/* Facility */}
      <div className="field">
        <label>
          Facility <span className="req">*</span>
        </label>
        <select
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          disabled={!eventType}
          className={errors.facilityId ? "error" : ""}
        >
          <option value="">
            {eventType ? "Select a facility" : "Select event first"}
          </option>
          {eligibleFacilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.facilityId && (
          <small className="error-text">{errors.facilityId}</small>
        )}
      </div>

      {/* Date */}
      <div className="field">
        <label>
          Event Date <span className="req">*</span>
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          min={minDate}
          className={errors.eventDate ? "error" : ""}
        />
        <small className="hint">Minimum date: {minDate}</small>
        {errors.eventDate && (
          <small className="error-text">{errors.eventDate}</small>
        )}
      </div>

      {/* Time */}
      <div className="field">
        <label>
          Start Time <span className="req">*</span>
        </label>
        <input
          type="time"
          value={timeFrom}
          onChange={(e) => setTimeFrom(e.target.value)}
        />
      </div>

      <div className="field">
        <label>
          End Time <span className="req">*</span>
        </label>
        <input
          type="time"
          value={timeTo}
          onChange={(e) => setTimeTo(e.target.value)}
          className={errors.time ? "error" : ""}
        />
        {errors.time && <small className="error-text">{errors.time}</small>}
      </div>

      {/* Resources */}
      <div className="field span-2">
        <label>Available Resources</label>
        {!selectedFacility && (
          <div className="muted">
            Select a facility to view available resources.
          </div>
        )}
        {selectedFacility && (
          <div className="resources">
            {Object.entries(selectedFacility.supports).map(([key, spec]) => (
              <div key={key}>{renderResourceControl(key, spec)}</div>
            ))}
          </div>
        )}
        <small className="hint">
          Unavailable items are disabled. Quantity fields cap at their maximum
          for the facility.
        </small>
      </div>

      {/* Queries */}
      <div className="field span-2">
        <label>Additional Requests / Queries</label>
        <textarea
          rows={4}
          placeholder="Any special requests for seating layout, stage setup, snacks timing, VIP entry, etc."
          value={queries}
          onChange={(e) => setQueries(e.target.value)}
        />
        <small className="hint">
          The facility in-charge will see this and can respond on approval.
        </small>
      </div>

      {/* Route Preview */}
      <div className="field span-2">
        <label>Approval Route</label>
        <div className="route glass-subtle">
          {selectedFacility ? (
            selectedFacility.admins.map((a, i) => (
              <div key={i} className="pill">
                <span className="dot" /> {a.name} &lt;{a.email}&gt;
              </div>
            ))
          ) : (
            <span className="muted">
              Select a facility to see its in-charge.
            </span>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="actions span-2">
        <button type="submit" className="primary glow">
          Submit Booking Request
        </button>
        {submitMsg && (
          <div className={`toast ${submitMsg.type}`}>{submitMsg.text}</div>
        )}
      </div>
    </form>
  </div>
</section>

      <Footer />
    </div>
  );
};

// ---------------------- CSS (in-file) ----------------------
const CSS = `
:root{
  --primary:${COLORS.primary};
  --secondary:${COLORS.secondary};
  --bg:${COLORS.background};
  --surface:${COLORS.surface};
  --border:${COLORS.border};
  --text:${COLORS.textPrimary};
  --text2:${COLORS.textSecondary};
  --success:${COLORS.success};
  --danger:${COLORS.danger};
  --warning:${COLORS.warning};
}

*{ box-sizing:border-box }
html, body, #root { height:100%; }
body { margin:0; background: radial-gradient(1200px 600px at 15% 10%, rgba(108,92,231,0.15), transparent 60%),
                      radial-gradient(1000px 500px at 85% 20%, rgba(142,124,246,0.12), transparent 60%),
                      var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
a { color:inherit; text-decoration:none }

.page-root { min-height:100vh; display:flex; flex-direction:column; }

/* Glass + Elevation */
.glass { background: var(--surface); border:1px solid var(--border); backdrop-filter: blur(12px); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
.glass-subtle { background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px); border-radius: 14px; }
.lift { transition: transform .3s ease, box-shadow .3s ease; }
.lift:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(0,0,0,0.35); }
.glow { position:relative; }
.glow::after { content:""; position:absolute; inset:-2px; border-radius:inherit; padding:2px; background:linear-gradient(120deg, rgba(108,92,231,0.7), rgba(142,124,246,0.6), transparent 60%); -webkit-mask: 
  linear-gradient(#000 0 0) content-box, 
  linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events:none; animation: borderGlow 4s ease-in-out infinite; }
@keyframes borderGlow {
  0% { opacity: .4 }
  50% { opacity: .9 }
  100% { opacity: .4 }
}

/* Header */
.header { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:14px 28px; margin:14px; background:rgba(10,15,30,0.6); }
.brand { display:flex; align-items:center; gap:12px; }
.logo { width:42px; height:42px; object-fit:contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); }
.title { font-weight:800; letter-spacing:.3px; font-size: clamp(14px, 2.5vw, 18px); }
.nav { display:flex; align-items:center; gap:18px; }
.nav a { padding:8px 12px; border-radius:10px; color:var(--text2); transition: background .2s; }
.nav a:hover { background: rgba(255,255,255,0.06); color:var(--text); }
.nav .active { background: rgba(108,92,231,0.2); color:white; }

/* Hero */
.hero { position:relative; height: 72vh; min-height:520px; overflow:hidden; margin: 8px 14px 0; border-radius:0px; }
.hero-video { position:absolute; width:100%; height:100%; object-fit:cover; inset:0; z-index:1; }
.hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(6,10,22,0.5), rgba(6,10,22,0.85)); z-index:2; }
.hero-content { position:relative; z-index:3; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 16px; }
.hero h1 { font-size:clamp(28px, 5.5vw, 56px); margin:0 0 12px; text-shadow: 0 6px 24px rgba(0,0,0,0.6); }
.hero p { max-width:860px; color:var(--text2); margin:0 0 24px; font-size:clamp(14px, 2.2vw, 18px); }
.cta-button { display:inline-block; padding:12px 20px; border-radius:12px; background: linear-gradient(130deg, var(--primary), var(--secondary)); color:white; font-weight:700; box-shadow: 0 12px 30px rgba(108,92,231,0.35); }
.cta-button:hover { transform: translateY(-1px); }

/* Floating orbs */
.orbs .orb { position:absolute; z-index:2; filter: blur(30px); opacity:.35; background: radial-gradient(closest-side, var(--primary), transparent); }
.orbs .o1 { width:220px; height:220px; top:8%; left:8%; animation: float 9s ease-in-out infinite; }
.orbs .o2 { width:160px; height:160px; bottom:14%; right:12%; animation: float 11s ease-in-out infinite reverse; }
.orbs .o3 { width:120px; height:120px; top:20%; right:25%; animation: float 13s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }

/* Intro */
.intro { display:flex; justify-content:center; padding:42px 16px 24px; }
.intro .card { max-width:980px; padding:24px; }

/* Gallery */



/* ---------- Gallery centered (Slick-friendly) ---------- */
/* top-level section spacing only — do NOT force display:flex here */
.gallery {
  padding: 18px;
}

/* center & constrain the actual slick slider container */
.gallery .slick-slider {
  width: 80%;
  max-width: 900px;
  margin: 0 auto;      /* centers the whole slider */
  border-radius: 16px;
}

/* make each slick-slide center its content — important */
.gallery .slick-slide {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

/* image styling — responsive and safe with Slick */
.slide img {
  display: block;
  width: 100%;
  max-width: 820px;     /* prevents extreme stretching on large screens */
  height: auto;
  max-height: 450px;    /* prevents excessive height */
  object-fit: cover;
  border-radius: 16px;
}

/* mobile adjustments */
@media (max-width: 880px) {
  .gallery .slick-slider { width: 95%; }
  .slide img { max-height: 280px; border-radius: 12px; }
}

/* Form */
.form-wrap { display:flex; justify-content:center; padding: 54px 16px 24px; }
.form-wrap .card { width: min(1100px, 96%); padding: 24px; }
.form-head { display:flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.form-head h3 { margin:0; font-size: clamp(18px, 3vw, 24px); }
.form-head p { margin:0; color:var(--warning); opacity:.95; }

.grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display:flex; flex-direction:column; gap:8px; }
.field span.req { color:#ff6b6b; margin-left:4px; }
.field input, .field select, .field textarea { width:100%; padding:12px 14px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); color:var(--text); outline:none; }
.field input::placeholder, .field textarea::placeholder { color:#94a3b8; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(142,124,246,0.25); }
.field .hint { color:#9aa8bf; font-size: 12px; }
.field .muted { color:#98a4ba; font-size:14px; }
.field .error-text { color: var(--danger); font-size: 12px; }
.error { border-color: var(--danger) !important; }

.span-2 { grid-column: span 2; }

.resources { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px; padding: 10px; background: rgba(255,255,255,0.04); border:1px dashed rgba(255,255,255,0.14); border-radius:14px; }
.res-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); }
.res-item input[type="checkbox"] { width:18px; height:18px; accent-color: var(--primary); }
.res-item.qty { justify-content: space-between; gap:14px; }
.res-item.qty input[type="number"] { width: 120px; text-align:right; }
.res-item .hint { color:#9aa8bf; font-size:12px; }
.res-item.disabled { opacity:.5; pointer-events:none; }

.route { display:flex; gap:10px; flex-wrap:wrap; padding:10px; }
.pill { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; background: rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.14); font-size:13px; color:var(--text2); }
.pill .dot { width:8px; height:8px; border-radius:999px; background: var(--success); display:inline-block; }

.actions { display:flex; align-items:center; gap:12px; }
.primary { border:0; padding:12px 16px; border-radius:12px; background: linear-gradient(130deg, var(--primary), var(--secondary)); color:white; font-weight:800; letter-spacing:.3px; cursor:pointer; box-shadow: 0 14px 36px rgba(108,92,231,0.35); }
.primary:hover { transform: translateY(-1px); }
.toast { padding:10px 12px; border-radius:12px; font-size:14px; }
.toast.success { background: rgba(20,184,166,0.15); border: 1px solid rgba(20,184,166,0.35); color:#99f6e4; }
.toast.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); color:#fecaca; }

/* Quick Links */
.quick-links { padding: 28px 16px 60px; text-align:center; }
.quick-links h2 { margin: 8px 0 18px; }
.quick-links .btns { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
.quick-links button { padding:10px 14px; border-radius:12px; background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.16); color:var(--text); cursor:pointer; transition: .2s; }
.quick-links button:hover { background: rgba(255,255,255,0.12); transform: translateY(-1px); }

/* Footer */
.footer { padding: 24px 18px 40px; text-align:center; color:var(--text2); }

/* Animations */
.fade-up { animation: fadeUp .8s ease both; }
@keyframes fadeUp { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }

/* Responsive */
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
  .resources { grid-template-columns: 1fr; }
  .hero { height: 60vh; }
  .slide img { height: 280px; }
}
`;

export default Booking;
