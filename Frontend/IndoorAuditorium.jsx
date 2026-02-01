import React, { useState } from "react";
import { requestbooking } from "./script.js";
import { useNavigate } from "react-router-dom";
export default function AV() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  function handleback() {
    navigate(-1);
  }
  return (
    <div className="booking-container">
<div class="styled-wrapper">
  <button class="button" onClick={handleback}>
    <div class="button-box">
      <span class="button-elem">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="arrow-icon"
        >
          <path
            fill="black"
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
          ></path>
        </svg>
      </span>
      <span class="button-elem">
  <svg
    fill="black"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class="arrow-icon"
  >
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
  </svg>
</span>

    </div>
  </button>
</div>


      <div className="facility-info">
        <h2>Indoor Auditorium</h2>
        <p>Capacity: 150 people</p>
        <p>Includes projector, sound system, and AC</p>
      </div>
      <div className="form-group">
        <label htmlFor="">Name :</label>
        <input
          id="name"
          type="text"
          placeholder="Enter Your Name.."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="">Your Role :</label>
        <select
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          <option value="student">STUDENT</option>
          <option value="hod">HOD</option>
          <option value="staff">STAFF</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dept">Department:</label>
        <input
          id="dept"
          type="text"
          placeholder="Enter Department Name"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        />
      </div>

      {role === "student" && (
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            id="year"
            type="number"
            placeholder="Year of Studying..."
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="">Purpose :</label>
        <input
          id="purpose"
          type="text"
          placeholder="Ex : Hackathon,Seminar,Virtual Programs etc.."
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Select Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-group time-group">
        <div>
          <label>Start Time</label>
          <input
            id="sttime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            id="endtime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="existing-bookings">
        <h3>Time Slots Available</h3>
        <ul>
          <li>10:00 AM - 12:00 PM</li>
          <li>2:00 PM - 4:00 PM</li>
        </ul>
      </div>
      
      
      <button onClick={requestbooking} className="req-btn"> Request Booking
      </button>
    </div>
  );
}
