import type { Request, Response } from "express";
import User from "../models/User";
import Otp from "../models/Otp";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ✅ Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({ email, otp: otpCode, expiresAt });

    console.log("OTP generated:", otpCode);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Notes App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, password } = req.body; // frontend se aayega

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    console.log("Verifying OTP for:", email, "OTP:", otp);

    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) return res.status(400).json({ message: "Invalid OTP" });

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const hashedPass = password ? await bcrypt.hash(password, 10) : undefined;
      user = await User.create({ email, name, password: hashedPass });
    }

    await Otp.deleteMany({ email });

    console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "OTP verified successfully", token, user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
