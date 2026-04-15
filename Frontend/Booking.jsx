import React, { useContext, useDeferredValue, useEffect, useMemo, useState } from "react";
import Header from "../src/components/layout/Header";
import Footer from "../src/components/layout/Footer";
import { AuthContext } from "../src/App";
import { apiRequest, getAuthHeaders } from "../src/lib/api";
import { FACILITIES, PURPOSES, getFacilitiesByPurpose, getFacilityById } from "../src/data/facilities";

const DEFAULT_FORM = {
  purpose: "Hackathon",
  facilityId: "",
  eventTitle: "",
  organizer: "",
  contact: "",
  attendees: "",
  date: "",
  startTime: "10:00",
  endTime: "13:00",
  notes: "",
  notificationChannel: "Email + SMS",
  needsQrCheckIn: true,
};

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 19;
const SLOT_DURATION_HOURS = 1;

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const normalizedHours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const normalizedMinutes = String(minutes % 60).padStart(2, "0");
  return `${normalizedHours}:${normalizedMinutes}`;
};

const toTimeRange = (start, end) => `${start} - ${end}`;

const getBookingDuration = (startTime, endTime) => {
  const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max(duration, 60);
};

const getMinimumDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  return currentDate.toISOString().split("T")[0];
};

const getDurationLabel = (startTime, endTime) => {
  const durationInMinutes = getBookingDuration(startTime, endTime);
  const hours = durationInMinutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hrs`;
};

const computeSuggestions = (availability, startTime, endTime) => {
  const requestedDuration = getBookingDuration(startTime, endTime);
  const busyRanges = (availability?.bookings || [])
    .map((booking) => ({
      start: timeToMinutes(booking.startTime),
      end: timeToMinutes(booking.endTime),
    }))
    .sort((left, right) => left.start - right.start);

  const suggestions = [];

  for (let current = SLOT_START_HOUR * 60; current + requestedDuration <= SLOT_END_HOUR * 60; current += SLOT_DURATION_HOURS * 60) {
    const proposedStart = current;
    const proposedEnd = current + requestedDuration;

    const overlaps = busyRanges.some(
      (booking) => proposedStart < booking.end && proposedEnd > booking.start
    );

    if (!overlaps) {
      suggestions.push({
        startTime: minutesToTime(proposedStart),
        endTime: minutesToTime(proposedEnd),
      });
    }
  }

  return suggestions.slice(0, 4);
};

const Booking = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    organizer: user?.role === "Student" ? "" : user?.email || "",
  });
  const deferredPurpose = useDeferredValue(form.purpose);
  const [availability, setAvailability] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [dashboardBookings, setDashboardBookings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusVariant, setStatusVariant] = useState("success");

  const recommendedFacilities = useMemo(
    () => getFacilitiesByPurpose(deferredPurpose),
    [deferredPurpose]
  );

  const selectedFacility = useMemo(
    () => getFacilityById(form.facilityId) ?? recommendedFacilities[0] ?? null,
    [form.facilityId, recommendedFacilities]
  );

  useEffect(() => {
    if (recommendedFacilities.length && !recommendedFacilities.some((facility) => facility.id === form.facilityId)) {
      setForm((current) => ({
        ...current,
        facilityId: recommendedFacilities[0].id,
      }));
    }
  }, [form.facilityId, recommendedFacilities]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ownData, allData] = await Promise.all([
          apiRequest("/api/bookings/my", {
            headers: getAuthHeaders(),
          }),
          apiRequest("/api/bookings/dashboard", {
            headers: getAuthHeaders(),
          }),
        ]);

        setMyBookings(ownData.bookings || []);
        setDashboardBookings(allData.bookings || []);
      } catch {
        setMyBookings([]);
        setDashboardBookings([]);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedFacility || !form.date) {
      setAvailability(null);
      return;
    }

    const fetchAvailability = async () => {
      setLoadingAvailability(true);

      try {
        const data = await apiRequest(
          `/api/bookings/availability?facility=${selectedFacility.name}&date=${form.date}`,
          {
            headers: getAuthHeaders(),
          }
        );
        setAvailability(data);
      } catch {
        setAvailability(null);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [form.date, selectedFacility]);

  const aiSuggestions = useMemo(() => {
    if (!availability) {
      return [];
    }

    return computeSuggestions(availability, form.startTime, form.endTime);
  }, [availability, form.startTime, form.endTime]);

  const analytics = useMemo(() => {
    const approvedCount = dashboardBookings.filter((booking) => booking.status === "Approved").length;
    const pendingCount = dashboardBookings.filter((booking) => booking.status === "Pending").length;
    const today = new Date().toISOString().split("T")[0];
    const todaysEvents = dashboardBookings.filter((booking) => booking.date?.startsWith(today)).length;

    return [
      { label: "Total requests", value: dashboardBookings.length || 0 },
      { label: "Approved events", value: approvedCount || 0 },
      { label: "Pending approvals", value: pendingCount || 0 },
      { label: "Today's bookings", value: todaysEvents || 0 },
    ];
  }, [dashboardBookings]);

  const approvalRoute = selectedFacility?.approvals?.length
    ? selectedFacility.approvals
    : ["Instant approval"];

  const availabilityLabel = availability?.isAvailable
    ? "Available for the selected slot"
    : "Conflict detected for the selected slot";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const applySuggestedSlot = (slot) => {
    setForm((current) => ({
      ...current,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/api/bookings", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          eventTitle: form.eventTitle,
          purpose: form.purpose,
          facility: selectedFacility?.name,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          organizer: form.organizer,
          contact: form.contact,
          attendees: Number(form.attendees || 0),
          notes: form.notes,
          notificationChannel: form.notificationChannel,
          needsQrCheckIn: form.needsQrCheckIn,
        }),
      });

      setStatusVariant("success");
      setStatusMessage(data.message || "Booking request created successfully.");

      setForm((current) => ({
        ...current,
        eventTitle: "",
        contact: "",
        attendees: "",
        notes: "",
      }));

      const ownData = await apiRequest("/api/bookings/my", {
        headers: getAuthHeaders(),
      });
      setMyBookings(ownData.bookings || []);

      if (selectedFacility && form.date) {
        const refreshedAvailability = await apiRequest(
          `/api/bookings/availability?facility=${selectedFacility.name}&date=${form.date}`,
          {
            headers: getAuthHeaders(),
          }
        );
        setAvailability(refreshedAvailability);
      }
    } catch (requestError) {
      setStatusVariant("error");
      setStatusMessage(requestError.message || "Booking request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <Header />

      <main className="booking-shell">
        <section className="hero-panel">
          <div>
            <p className="hero-panel__eyebrow">Smart scheduling workspace</p>
            <h1>Book every campus facility with conflict-aware AI assistance.</h1>
            <p className="hero-panel__copy">
              Purpose-based venue recommendations, live availability, approval routing,
              reminders, and booking analytics are all built into one professional flow.
            </p>
          </div>

          <div className="hero-panel__stats">
            {analytics.map((item) => (
              <article key={item.label} className="stat-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="smart-grid">
          <article className="panel panel--wide">
            <div className="panel__header">
              <div>
                <p className="panel__eyebrow">Purpose-led discovery</p>
                <h2>Recommended venues by event type</h2>
              </div>

              <select name="purpose" value={form.purpose} onChange={handleChange} className="purpose-select">
                {PURPOSES.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>

            <div className="facility-grid">
              {recommendedFacilities.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  className={selectedFacility?.id === facility.id ? "facility-card active" : "facility-card"}
                  onClick={() => setForm((current) => ({ ...current, facilityId: facility.id }))}
                >
                  <div className="facility-card__head">
                    <span>{facility.category}</span>
                    <strong>{facility.capacity}+ seats</strong>
                  </div>
                  <h3>{facility.name}</h3>
                  <p>{facility.description}</p>
                  <div className="pill-row">
                    {facility.amenities.slice(0, 3).map((item) => (
                      <span key={item} className="mini-pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </article>

          <aside className="panel">
            <p className="panel__eyebrow">Approval route</p>
            <h2>Who needs to approve</h2>
            <div className="timeline">
              {approvalRoute.map((approver) => (
                <div key={approver} className="timeline__item">
                  <span className="timeline__dot" />
                  <div>
                    <strong>{approver}</strong>
                    <p>{approver === "Instant approval" ? "No manual review required." : "Request moves here after submission."}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reminder-box">
              <strong>Notifications enabled</strong>
              <p>{form.notificationChannel} confirmation and reminder will be prepared automatically.</p>
            </div>
          </aside>
        </section>

        <section className="workspace-grid">
          <article className="panel panel--form">
            <div className="panel__header">
              <div>
                <p className="panel__eyebrow">Booking request</p>
                <h2>Create a new reservation</h2>
              </div>
              <div className={availability?.isAvailable ? "status-badge success" : "status-badge warning"}>
                {availabilityLabel}
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <label>
                Event title
                <input
                  type="text"
                  name="eventTitle"
                  value={form.eventTitle}
                  onChange={handleChange}
                  placeholder="AI Integrated Hackathon 2026"
                  required
                />
              </label>

              <label>
                Facility
                <input type="text" value={selectedFacility?.name || ""} readOnly />
              </label>

              <label>
                Organizer
                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="Faculty or event lead"
                  required
                />
              </label>

              <label>
                Contact number
                <input
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="+91 9XXXXXXXXX"
                  required
                />
              </label>

              <label>
                Event date
                <input type="date" name="date" value={form.date} onChange={handleChange} min={getMinimumDate()} required />
              </label>

              <label>
                Expected attendees
                <input
                  type="number"
                  name="attendees"
                  min="1"
                  max={selectedFacility?.capacity || 2000}
                  value={form.attendees}
                  onChange={handleChange}
                  placeholder={`Max ${selectedFacility?.capacity || 0}`}
                  required
                />
              </label>

              <label>
                Start time
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
              </label>

              <label>
                End time
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
              </label>

              <label>
                Confirmation channel
                <select name="notificationChannel" value={form.notificationChannel} onChange={handleChange}>
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Email + SMS</option>
                </select>
              </label>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="needsQrCheckIn"
                  checked={form.needsQrCheckIn}
                  onChange={handleChange}
                />
                Enable optional QR code check-in on event day
              </label>

              <label className="field-span">
                Special notes
                <textarea
                  name="notes"
                  rows="4"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Stage setup, volunteer support, refreshments, or security requests."
                />
              </label>

              <div className="field-span form-footer">
                <div>
                  <strong>{getDurationLabel(form.startTime, form.endTime)}</strong>
                  <p>Notification preview: confirmation on approval, reminder 2 hours before the event.</p>
                </div>
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit booking request"}
                </button>
              </div>

              {statusMessage ? (
                <p className={statusVariant === "success" ? "message success" : "message error"}>
                  {statusMessage}
                </p>
              ) : null}
            </form>
          </article>

          <aside className="workspace-side">
            <article className="panel">
              <p className="panel__eyebrow">Live availability</p>
              <h2>{selectedFacility?.name || "Select a facility"}</h2>
              <p className="availability-subtitle">
                {form.date ? `Checking ${formatDate(form.date)}` : "Pick a date to see booked slots."}
              </p>

              {loadingAvailability ? <p className="empty-state">Loading slot availability...</p> : null}

              {!loadingAvailability && availability?.bookings?.length ? (
                <div className="slot-list">
                  {availability.bookings.map((booking) => (
                    <div key={booking.id} className="slot-chip">
                      <strong>{toTimeRange(booking.startTime, booking.endTime)}</strong>
                      <span>{booking.eventTitle}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {!loadingAvailability && form.date && !availability?.bookings?.length ? (
                <p className="empty-state">No bookings on this date yet.</p>
              ) : null}
            </article>

            <article className="panel">
              <p className="panel__eyebrow">AI smart suggestions</p>
              <h2>Next best time slots</h2>
              <div className="slot-list">
                {aiSuggestions.length ? (
                  aiSuggestions.map((slot) => (
                    <button
                      key={slot.startTime}
                      type="button"
                      className="suggestion-card"
                      onClick={() => applySuggestedSlot(slot)}
                    >
                      <strong>{toTimeRange(slot.startTime, slot.endTime)}</strong>
                      <span>{availability?.isAvailable ? "Also available now" : "Recommended conflict-free slot"}</span>
                    </button>
                  ))
                ) : (
                  <p className="empty-state">Choose a date to generate smart slot recommendations.</p>
                )}
              </div>
            </article>

            <article className="panel">
              <p className="panel__eyebrow">Your latest requests</p>
              <h2>Recent booking history</h2>
              <div className="history-list">
                {myBookings.slice(0, 4).map((booking) => (
                  <div key={booking.id} className="history-item">
                    <div>
                      <strong>{booking.eventTitle}</strong>
                      <p>
                        {booking.facility} on {formatDate(booking.date)}
                      </p>
                    </div>
                    <span className={`history-status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                ))}

                {!myBookings.length ? <p className="empty-state">No requests yet. Your submissions will appear here.</p> : null}
              </div>
            </article>
          </aside>
        </section>
      </main>

      <Footer />

      <style>{`
        .booking-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 15% 15%, rgba(20, 184, 166, 0.16), transparent 26%),
            radial-gradient(circle at 85% 8%, rgba(249, 115, 22, 0.16), transparent 20%),
            linear-gradient(180deg, #061522 0%, #081a28 48%, #07131d 100%);
          color: #ecf7f9;
        }

        .booking-shell {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 1.25rem 5rem;
        }

        .hero-panel,
        .panel {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          box-shadow: 0 28px 60px rgba(2, 12, 24, 0.22);
        }

        .hero-panel {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1.8rem;
          padding: 2rem;
          border-radius: 34px;
          margin-top: 1.25rem;
        }

        .hero-panel__eyebrow,
        .panel__eyebrow {
          margin: 0;
          color: #8fe3cf;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.76rem;
        }

        .hero-panel h1,
        .panel h2 {
          margin: 0.5rem 0 0.7rem;
          font-family: "Poppins", "Segoe UI", sans-serif;
        }

        .hero-panel h1 {
          font-size: clamp(2.3rem, 4.6vw, 4.4rem);
          line-height: 0.97;
          max-width: 780px;
        }

        .hero-panel__copy {
          max-width: 760px;
          line-height: 1.7;
          color: rgba(227, 239, 242, 0.82);
        }

        .hero-panel__stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .stat-card {
          border-radius: 24px;
          padding: 1.2rem;
          background: linear-gradient(180deg, rgba(8, 39, 52, 0.9), rgba(4, 23, 34, 0.9));
        }

        .stat-card strong {
          display: block;
          font-size: 2rem;
          margin-bottom: 0.35rem;
        }

        .stat-card span {
          color: rgba(215, 230, 233, 0.76);
        }

        .smart-grid,
        .workspace-grid {
          display: grid;
          gap: 1.4rem;
          margin-top: 1.4rem;
        }

        .smart-grid {
          grid-template-columns: 1.35fr 0.65fr;
        }

        .workspace-grid {
          grid-template-columns: 1.15fr 0.85fr;
          align-items: start;
        }

        .workspace-side {
          display: grid;
          gap: 1.4rem;
        }

        .panel {
          border-radius: 30px;
          padding: 1.4rem;
        }

        .panel--wide {
          padding-bottom: 1.2rem;
        }

        .panel__header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .purpose-select,
        .booking-form input,
        .booking-form select,
        .booking-form textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 0.95rem 1rem;
          background: rgba(6, 24, 36, 0.85);
          color: white;
          outline: none;
        }

        .purpose-select {
          max-width: 220px;
        }

        .facility-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .facility-card,
        .suggestion-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.04);
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .facility-card:hover,
        .facility-card.active,
        .suggestion-card:hover {
          transform: translateY(-2px);
          border-color: rgba(20, 184, 166, 0.55);
          box-shadow: 0 20px 36px rgba(2, 12, 24, 0.22);
        }

        .facility-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: rgba(212, 231, 234, 0.75);
          font-size: 0.82rem;
        }

        .facility-card h3 {
          margin: 0.65rem 0 0.4rem;
          font-size: 1.15rem;
        }

        .facility-card p,
        .timeline__item p,
        .empty-state,
        .availability-subtitle,
        .history-item p,
        .form-footer p,
        .reminder-box p {
          margin: 0;
          color: rgba(216, 232, 235, 0.74);
          line-height: 1.6;
        }

        .pill-row,
        .slot-list,
        .history-list {
          display: grid;
          gap: 0.75rem;
        }

        .mini-pill {
          display: inline-flex;
          margin-right: 0.45rem;
          margin-top: 0.4rem;
          padding: 0.38rem 0.72rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #eaf6f8;
          font-size: 0.78rem;
        }

        .timeline {
          display: grid;
          gap: 1rem;
        }

        .timeline__item {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 0.8rem;
          align-items: start;
        }

        .timeline__dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, #14b8a6, #0ea5e9);
          margin-top: 0.45rem;
        }

        .reminder-box {
          margin-top: 1.2rem;
          padding: 1rem;
          border-radius: 22px;
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(14, 165, 233, 0.2);
        }

        .booking-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .booking-form label {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          color: rgba(236, 246, 248, 0.9);
          font-weight: 600;
        }

        .booking-form input:focus,
        .booking-form select:focus,
        .booking-form textarea:focus,
        .purpose-select:focus {
          border-color: rgba(20, 184, 166, 0.75);
          box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.14);
        }

        .checkbox-field {
          flex-direction: row;
          align-items: center;
          gap: 0.7rem;
          align-self: end;
          padding: 0.85rem 1rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          font-weight: 500;
        }

        .checkbox-field input {
          width: auto;
        }

        .field-span,
        .form-footer,
        .message {
          grid-column: 1 / -1;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .primary-button {
          border: 0;
          border-radius: 18px;
          padding: 1rem 1.2rem;
          background: linear-gradient(135deg, #14b8a6, #0ea5e9);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .status-badge,
        .history-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem 0.85rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .status-badge.success,
        .history-status.approved {
          background: rgba(34, 197, 94, 0.16);
          color: #bbf7d0;
        }

        .status-badge.warning,
        .history-status.pending {
          background: rgba(245, 158, 11, 0.16);
          color: #fde68a;
        }

        .history-status.rejected {
          background: rgba(239, 68, 68, 0.16);
          color: #fecaca;
        }

        .slot-chip {
          padding: 0.9rem 1rem;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
        }

        .slot-chip span,
        .suggestion-card span {
          color: rgba(214, 230, 232, 0.72);
        }

        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.95rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .history-item:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .message {
          padding: 0.95rem 1rem;
          border-radius: 18px;
          font-weight: 600;
        }

        .message.success {
          background: rgba(34, 197, 94, 0.14);
          color: #bbf7d0;
          border: 1px solid rgba(34, 197, 94, 0.26);
        }

        .message.error {
          background: rgba(239, 68, 68, 0.14);
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.26);
        }

        @media (max-width: 1080px) {
          .hero-panel,
          .smart-grid,
          .workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .hero-panel__stats,
          .booking-form {
            grid-template-columns: 1fr;
          }

          .panel__header,
          .form-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default Booking;
