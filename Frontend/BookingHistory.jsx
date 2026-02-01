import React, { useState } from "react";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error fetching bookings from server. Check console.");
    }
  };

  return (
    <div className="booking-history">
      <h2>📖 Booking History</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={fetchBookings} className="fetch-btn">
          Fetch Bookings
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Year</th>
              <th>Organizer</th>
              <th>Purpose</th>
              <th>Facility</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.role}</td>
                <td>{b.department}</td>
                <td>{b.year}</td>
                <td>{b.organizer || "—"}</td>
                <td>{b.purpose}</td>
                <td>{b.facility}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>
                  {String(b.starttime).replace(/(\d{2})(\d{2})/, "$1:$2")} -{" "}
                  {String(b.endtime).replace(/(\d{2})(\d{2})/, "$1:$2")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .booking-history {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .fetch-btn {
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .fetch-btn:hover {
          background-color: #1d4ed8;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        thead {
          background: #2563eb;
          color: white;
        }
        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default BookingHistory;
