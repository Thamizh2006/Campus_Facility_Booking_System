// =========================
// Fetch list of facilities for a selected event
// =========================
export async function fetchFacilities(eventName) {
  try {
    const res = await fetch(`/api/facilities/${encodeURIComponent(eventName)}`);
    if (!res.ok) throw new Error(`Error fetching facilities for ${eventName}`);
    return await res.json();
  } catch (err) {
    console.error("fetchFacilities error:", err);
    return [];
  }
}

// =========================
// Fetch list of resources for a selected event & facility
// =========================
export async function fetchResources(eventName, facilityName) {
  try {
    const res = await fetch(`/api/resources/${encodeURIComponent(eventName)}/${encodeURIComponent(facilityName)}`);
    if (!res.ok) throw new Error(`Error fetching resources for ${facilityName}`);
    return await res.json();
  } catch (err) {
    console.error("fetchResources error:", err);
    return [];
  }
}

// =========================
// Fetch available time slots for a facility on a given date
// =========================
export async function fetchAvailability(facilityName, date) {
  try {
    const res = await fetch(`/api/availability/${encodeURIComponent(facilityName)}/${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error(`Error fetching availability for ${facilityName} on ${date}`);
    return await res.json();
  } catch (err) {
    console.error("fetchAvailability error:", err);
    return [];
  }
}

// =========================
// Send booking request
// =========================
export async function requestbooking(bookingData) {
  let dataToSend = bookingData;

  // Only collect from DOM if not passed explicitly
  if (!bookingData) {
    const name = document.getElementById("name")?.value.trim();
    const role = document.getElementById("role")?.value.trim();
    const department = document.getElementById("dept")?.value.trim();
    const year = document.getElementById("year")?.value.trim() || "";
    const purpose = document.getElementById("purpose")?.value.trim();
    const date = document.getElementById("date")?.value.trim();
    const starttime = document.getElementById("sttime")?.value.trim();
    const endtime = document.getElementById("endtime")?.value.trim();

    if (!name || !role || !department || !purpose || !date || !starttime || !endtime || (role === "student" && !year)) {
      alert("Please fill all required fields.");
      return;
    }

    dataToSend = { name, role, department, year, purpose, date, starttime, endtime };
  }

  try {
    const response = await fetch("http://localhost:8080/av/requestbooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (response.status === 201) {
      alert("Booking successful!");
    } else {
      alert(data.message || "Booking failed");
    }

    return data;
  } catch (err) {
    alert("Error connecting to server.");
    console.error(err);
    return { success: false, message: "Booking failed" };
  }
}
