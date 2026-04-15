import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      required: function () {
        return this.role !== "Student";
      },
    },
    rollno: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
      match: /^[0-9]{2}[A-Z]{2}[0-9]{3}$/,
      required: function () {
        return this.role === "Student";
      },
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
      trim: true,
      default: "",
    },
    accessLevel: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
