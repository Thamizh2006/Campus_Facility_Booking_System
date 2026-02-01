import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  organizer: { type: String, default: "" },
  purpose: { type: String, required: true },
  facility: { type: String, required: true },
  date: { type: Date, required: true },
  starttime: { type: String, required: true },
  endtime: { type: String, required: true },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approvedBy: {
    type: String,
    default: "",
  },
  rejectionReason: {
    type: String,
    default: "",
  },

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookSchema);
export default Booking;
