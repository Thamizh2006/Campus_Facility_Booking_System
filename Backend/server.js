import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { protect, authorizeRoles } from "./middleware/authMiddleware.js";
import Booking from "./models/BookingSchema.js";
import Signup from "./models/SignupSchema.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

/* ================================
   DATABASE CONNECTION
   ================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================================
   LOGIN ROUTE (STEP 1 CORE)
   ================================ */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

/* ================================
   BOOKING ROUTES (UNCHANGED)
   ================================ */
app.post("/av/requestbooking", async (req, res) => {
  const {
    name,
    role,
    department,
    year,
    purpose,
    date,
    starttime,
    endtime,
    facility,
  } = req.body;

  try {
    const requestedDate = new Date(date);
    const start = parseInt(starttime.replace(":", ""), 10);
    const end = parseInt(endtime.replace(":", ""), 10);

    const bookConflict = await Booking.findOne({
      facility,
      date: requestedDate,
      $or: [
        { $and: [{ starttime: { $lte: start } }, { endtime: { $gt: start } }] },
        { $and: [{ starttime: { $lt: end } }, { endtime: { $gte: end } }] },
        { $and: [{ starttime: { $gte: start } }, { endtime: { $lte: end } }] },
      ],
    });

    if (bookConflict) {
      return res
        .status(400)
        .json({ message: "Slot already booked. Try a different time." });
    }

    const newBooking = new Booking({
      name,
      role,
      department,
      year,
      purpose,
      facility,
      date: requestedDate,
      starttime: start,
      endtime: end,
    });

    await newBooking.save();
    res.status(201).json({
      message: "Booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/* ================================
   FETCH BOOKINGS (UNCHANGED)
   ================================ */
app.get(
  "/api/bookings",
  protect,
  authorizeRoles("Admin", "HOD"),
  async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ date: -1, starttime: 1 });
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  }
);
app.put(
  "/api/bookings/:id/approve",
  protect,
  authorizeRoles("Admin", "HOD"),
  async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = "Approved";
      booking.approvedBy = req.user.role;
      booking.rejectionReason = "";

      await booking.save();

      res.json({ message: "Booking approved" });
    } catch (err) {
      res.status(500).json({ message: "Approval failed" });
    }
  }
);

app.put(
  "/api/bookings/:id/reject",
  protect,
  authorizeRoles("Admin", "HOD"),
  async (req, res) => {
    const { reason } = req.body;

    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = "Rejected";
      booking.rejectionReason = reason || "No reason provided";
      booking.approvedBy = req.user.role;

      await booking.save();

      res.json({ message: "Booking rejected" });
    } catch (err) {
      res.status(500).json({ message: "Rejection failed" });
    }
  }
);


app.delete(
  "/api/bookings/:id",
  protect,
  authorizeRoles("Admin"),
  async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  }
);

/* ================================
   SERVER START
   ================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
