import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const OtpVerifyPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const voterId = sessionStorage.getItem("pendingVoterId") || "";
  const password = sessionStorage.getItem("pendingPassword") || "";
  const demoOtp = sessionStorage.getItem("pendingOtp") || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await apiClient.post("/auth/verify-otp", { voterId, otp });
      const { data } = await apiClient.post("/auth/login", { voterId, password });

      login(data);
      sessionStorage.removeItem("pendingVoterId");
      sessionStorage.removeItem("pendingPassword");
      sessionStorage.removeItem("pendingOtp");

      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <section className="card">
      <h2>{t("verifyOtp")}</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input className="input" placeholder={t("otpCode")} value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button className="button-primary" type="submit">{t("submit")}</button>
      </form>
      {demoOtp ? <p className="success-text">Demo OTP: {demoOtp}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
};

export default OtpVerifyPage;
