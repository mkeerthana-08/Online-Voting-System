import { Route, Routes, useLocation } from "react-router-dom";

import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OtpVerifyPage from "./pages/OtpVerifyPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="page-shell">
      {!isLandingPage ? <TopBar /> : null}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpVerifyPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
