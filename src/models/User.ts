const mongoose = require("mongoose"); // Import the mongoose connection

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  salt: { type: String, required: true },
  email: String,
  firstName: { type: String },
  phoneNumber: { type: String },
  registrationDate: { type: Date, default: Date.now },
  userRole: { type: String, default: "DeskStaff" },
  status: { type: String, default: "active" },
  lastLoginDate: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
