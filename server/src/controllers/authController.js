const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
  setOtpForVoter,
  verifyOtpForVoter,
  isOtpVerified,
  clearOtpForVoter,
} = require("../utils/otpStore");

const register = async (req, res) => {
  try {
    const { name, email, phone, voterId, aadhaar, password, role } = req.body;

    if (!name || !email || !phone || !voterId || !aadhaar || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { voterId }, { aadhaar }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      voterId,
      aadhaar,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const requestOtp = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ message: "voterId and password are required" });
    }

    const user = await User.findOne({ voterId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = setOtpForVoter(voterId);

    return res.json({
      message: "OTP generated",
      voterId,
      otp,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { voterId, otp } = req.body;

    if (!voterId || !otp) {
      return res.status(400).json({ message: "voterId and otp are required" });
    }

    const result = verifyOtpForVoter(voterId, otp);

    if (!result.ok) {
      return res.status(400).json({ message: result.reason });
    }

    return res.json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({ message: "voterId and password are required" });
    }

    const user = await User.findOne({ voterId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!isOtpVerified(voterId)) {
      return res.status(403).json({ message: "OTP verification required" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        voterId: user.voterId,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1d" }
    );

    clearOtpForVoter(voterId);

    return res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        voterId: user.voterId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  requestOtp,
  verifyOtp,
  login,
};
