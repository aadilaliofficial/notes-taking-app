import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

const router = Router();

// ✅ OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// ✅ Get logged-in user profile
router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;
