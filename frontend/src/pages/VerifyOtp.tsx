import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../utils/api";

interface LocationState {
  email: string;
}

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
        name,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-1">Verify OTP</h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Enter OTP to complete your sign up
        </p>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          required
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 w-full rounded mb-3"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Verify & Continue
        </button>

        <p className="text-sm text-gray-500 text-center mt-3">
          Didn’t get OTP?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </form>
    </div>
  );
}
