import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { authorizeRoles, protect } from "./middleware/authMiddleware.js";
import Booking from "./models/BookingSchema.js";
import Signup from "./models/SignupSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT || 8080;
const app = express();

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()) || origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());

const toMinutes = (timeValue) => {
  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
};

const overlaps = (startA, endA, startB, endB) =>
  toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);

const toBookingResponse = (booking) => ({
  id: booking._id,
  eventTitle: booking.eventTitle,
  purpose: booking.purpose,
  facility: booking.facility,
  date: booking.date,
  startTime: booking.startTime,
  endTime: booking.endTime,
  organizer: booking.organizer,
  contact: booking.contact,
  attendees: booking.attendees,
  notes: booking.notes,
  notificationChannel: booking.notificationChannel,
  needsQrCheckIn: booking.needsQrCheckIn,
  status: booking.status,
  approvedBy: booking.approvedBy,
  rejectionReason: booking.rejectionReason,
  createdAt: booking.createdAt,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (_req, res) => {
  res.json({ message: "SJCE booking API is running" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "sjce-booking-backend",
    timestamp: new Date().toISOString(),
  });
});

app.post("/register", async (req, res) => {
  const { name, email, rollno, password, role, department } = req.body;

  try {
    if (!name || !password || !role) {
      return res.status(400).json({ message: "Name, role, and password are required" });
    }

    if (role === "Student" && !rollno) {
      return res.status(400).json({ message: "Roll number is required for student signup" });
    }

    if (role !== "Student" && !email) {
      return res.status(400).json({ message: "Email is required for this role" });
    }

    const normalizedEmail = email?.toLowerCase().trim();
    const normalizedRoll = rollno?.toUpperCase().trim();

    const existingUser = await Signup.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedRoll ? [{ rollno: normalizedRoll }] : []),
      ],
    });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email or roll number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Signup.create({
      name: name.trim(),
      email: normalizedEmail || undefined,
      rollno: normalizedRoll || undefined,
      password: hashedPassword,
      role,
      department: department?.trim() || "",
    });

    return res.status(201).json({
      message: "Account created successfully. Please sign in.",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email || "",
        rollno: user.rollno || "",
        department: user.department || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const identifier = email?.trim();
    const normalizedEmail = identifier?.toLowerCase();
    const normalizedRoll = identifier?.toUpperCase();

    const user = await Signup.findOne({
      $or: [{ email: normalizedEmail }, { rollno: normalizedRoll }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is registered as ${user.role}` });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        department: user.department || "",
        email: user.email || "",
        rollno: user.rollno || "",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.get("/api/bookings/availability", protect, async (req, res) => {
  const { facility, date, startTime, endTime } = req.query;

  try {
    const bookings = await Booking.find({
      facility,
      date,
      status: { $ne: "Rejected" },
    }).sort({ startTime: 1 });

    const hasConflict =
      startTime && endTime
        ? bookings.some((booking) => overlaps(startTime, endTime, booking.startTime, booking.endTime))
        : false;

    return res.json({
      facility,
      date,
      isAvailable: !hasConflict,
      bookings: bookings.map(toBookingResponse),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch availability", error: error.message });
  }
});

app.post("/api/bookings", protect, async (req, res) => {
  const {
    eventTitle,
    purpose,
    facility,
    date,
    startTime,
    endTime,
    organizer,
    contact,
    attendees,
    notes,
    notificationChannel,
    needsQrCheckIn,
  } = req.body;

  if (
    !eventTitle ||
    !purpose ||
    !facility ||
    !date ||
    !startTime ||
    !endTime ||
    !organizer ||
    !contact ||
    !attendees
  ) {
    return res.status(400).json({ message: "Please fill all required booking fields" });
  }

  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return res.status(400).json({ message: "End time must be later than start time" });
  }

  try {
    const conflictingBooking = await Booking.findOne({
      facility,
      date,
      status: { $ne: "Rejected" },
    });

    if (conflictingBooking) {
      const facilityBookings = await Booking.find({
        facility,
        date,
        status: { $ne: "Rejected" },
      });

      const directConflict = facilityBookings.find((booking) =>
        overlaps(startTime, endTime, booking.startTime, booking.endTime)
      );

      if (directConflict) {
        return res.status(409).json({
          message: "Selected slot is already booked. Try one of the suggested free slots.",
        });
      }
    }

    const booking = await Booking.create({
      userId: req.user._id,
      eventTitle,
      purpose,
      facility,
      date,
      startTime,
      endTime,
      organizer,
      contact,
      attendees,
      notes: notes || "",
      notificationChannel: notificationChannel || "Email + SMS",
      needsQrCheckIn: Boolean(needsQrCheckIn),
      status: ["Admin", "HOD"].includes(req.user.role) ? "Approved" : "Pending",
      approvedBy: ["Admin", "HOD"].includes(req.user.role) ? req.user.role : "",
    });

    return res.status(201).json({
      message:
        booking.status === "Approved"
          ? "Booking confirmed instantly."
          : "Booking request submitted and routed for approval.",
      booking: toBookingResponse(booking),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create booking", error: error.message });
  }
});

app.get("/api/bookings/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ bookings: bookings.map(toBookingResponse) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch your bookings", error: error.message });
  }
});

app.get("/api/bookings/dashboard", protect, async (req, res) => {
  try {
    const filter = ["Admin", "HOD"].includes(req.user.role) ? {} : { userId: req.user._id };
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json({ bookings: bookings.map(toBookingResponse) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch dashboard bookings", error: error.message });
  }
});

app.put("/api/bookings/:id/approve", protect, authorizeRoles("Admin", "HOD"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Approved";
    booking.approvedBy = req.user.role;
    booking.rejectionReason = "";
    await booking.save();

    return res.json({ message: "Booking approved", booking: toBookingResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: "Approval failed", error: error.message });
  }
});

app.put("/api/bookings/:id/reject", protect, authorizeRoles("Admin", "HOD"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Rejected";
    booking.approvedBy = req.user.role;
    booking.rejectionReason = req.body.reason || "Rejected by reviewer";
    await booking.save();

    return res.json({ message: "Booking rejected", booking: toBookingResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: "Rejection failed", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
