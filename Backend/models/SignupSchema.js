import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    required: function () {
      return this.role !== "Student";
    },
    unique: true,
    lowercase: true,
    trim: true,
  },
  rollno: {
    type: String,
    required: function () {
      return this.role === "Student";
    },
    unique: true,
    uppercase: true,
    match: /^[0-9]{2}[A-Z]{2}[0-9]{3}$/, // e.g., 23IT102
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Student", "Faculty", "HOD", "Admin"],
    required: true,
  },

  
  department: {
    type: String,
    required: function () {
      return ["Faculty", "HOD"].includes(this.role);
    },
  },
  accessLevel: {
    type: Number,
    default: 1, 
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
