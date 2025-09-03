import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
