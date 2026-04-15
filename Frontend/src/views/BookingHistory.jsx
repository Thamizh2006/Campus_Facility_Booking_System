import React, { useContext, useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../App";
import { apiRequest, getAuthHeaders } from "../lib/api";

const readableDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const canModerate = useMemo(
    () => ["Admin", "HOD"].includes(user?.role),
    [user?.role]
  );

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const endpoint = canModerate ? "/api/bookings/dashboard" : "/api/bookings/my";
      const data = await apiRequest(endpoint, {
        headers: getAuthHeaders(),
      });
      setBookings(data.bookings || []);
    } catch (requestError) {
      setMessage(requestError.message || "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [canModerate]);

  const updateStatus = async (bookingId, action) => {
    setMessage("");

    try {
      await apiRequest(`/api/bookings/${bookingId}/${action}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          reason: action === "reject" ? "Rejected from admin dashboard" : "",
        }),
      });
      fetchBookings();
    } catch (requestError) {
      setMessage(requestError.message || "Status update failed.");
    }
  };

  return (
    <div className="history-page">
      <Header />

      <main className="history-shell">
        <section className="history-hero">
          <div>
            <p className="history-hero__eyebrow">Booking records and approvals</p>
            <h1>{canModerate ? "Admin booking dashboard" : "Your booking history"}</h1>
            <p>
              Review facility requests, monitor statuses, and keep a clean audit trail of
              approvals, rejections, and confirmed events.
            </p>
          </div>
          <button type="button" className="refresh-button" onClick={fetchBookings}>
            Refresh data
          </button>
        </section>

        <section className="history-panel">
          {message ? <p className="info-banner">{message}</p> : null}

          {loading ? (
            <p className="empty-state">Loading booking records...</p>
          ) : !bookings.length ? (
            <p className="empty-state">No booking records found yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Purpose</th>
                    <th>Facility</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Organizer</th>
                    <th>Status</th>
                    {canModerate ? <th>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.eventTitle}</td>
                      <td>{booking.purpose}</td>
                      <td>{booking.facility}</td>
                      <td>{readableDate(booking.date)}</td>
                      <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                      <td>{booking.organizer}</td>
                      <td>
                        <span className={`status-tag ${booking.status.toLowerCase()}`}>{booking.status}</span>
                      </td>
                      {canModerate ? (
                        <td>
                          <div className="action-row">
                            <button type="button" className="approve" onClick={() => updateStatus(booking.id, "approve")}>
                              Approve
                            </button>
                            <button type="button" className="reject" onClick={() => updateStatus(booking.id, "reject")}>
                              Reject
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        .history-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(20, 184, 166, 0.12), transparent 26%),
            linear-gradient(180deg, #07131d 0%, #091d2a 100%);
          color: #ecf7f9;
        }

        .history-shell {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.25rem 5rem;
        }

        .history-hero,
        .history-panel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
        }

        .history-hero {
          margin-top: 1.25rem;
          border-radius: 30px;
          padding: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .history-hero__eyebrow {
          margin: 0;
          color: #8fe3cf;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.76rem;
        }

        .history-hero h1 {
          margin: 0.5rem 0;
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .history-hero p {
          margin: 0;
          max-width: 700px;
          color: rgba(219, 233, 236, 0.76);
          line-height: 1.7;
        }

        .refresh-button,
        .approve,
        .reject {
          border: 0;
          border-radius: 14px;
          padding: 0.85rem 1.1rem;
          color: white;
          cursor: pointer;
          font-weight: 700;
        }

        .refresh-button,
        .approve {
          background: linear-gradient(135deg, #14b8a6, #0ea5e9);
        }

        .reject {
          background: linear-gradient(135deg, #f97316, #ef4444);
        }

        .history-panel {
          margin-top: 1.25rem;
          border-radius: 30px;
          padding: 1.2rem;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: 1rem 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        th {
          color: rgba(206, 226, 229, 0.76);
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .status-tag {
          display: inline-flex;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .status-tag.approved {
          background: rgba(34, 197, 94, 0.16);
          color: #bbf7d0;
        }

        .status-tag.pending {
          background: rgba(245, 158, 11, 0.16);
          color: #fde68a;
        }

        .status-tag.rejected {
          background: rgba(239, 68, 68, 0.16);
          color: #fecaca;
        }

        .action-row {
          display: flex;
          gap: 0.5rem;
        }

        .empty-state,
        .info-banner {
          margin: 0;
          padding: 1rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(223, 235, 239, 0.76);
        }

        .info-banner {
          margin-bottom: 1rem;
          background: rgba(14, 165, 233, 0.14);
          border: 1px solid rgba(14, 165, 233, 0.24);
        }

        @media (max-width: 900px) {
          .history-hero {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingHistory;
