import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import apiClient from "../api/apiClient";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [error, setError] = useState("");

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const { data } = await apiClient.post("/auth/request-otp", { voterId, password });
      setOtpPreview(data.otp);
      sessionStorage.setItem("pendingVoterId", voterId);
      sessionStorage.setItem("pendingPassword", password);
      sessionStorage.setItem("pendingOtp", data.otp);
      navigate("/verify-otp");
    } catch (err) {
      const apiMessage = err.response?.data?.message;

      if (apiMessage === "Invalid credentials") {
        setError("Invalid credentials. Please register first or check voter ID/password.");
      } else if (apiMessage) {
        setError(apiMessage);
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Start backend on port 5000 and try again.");
      } else {
        setError(err.message || "Login failed");
      }
    }
  };

  return (
    <section className="card">
      <h2>{t("login")}</h2>
      <form className="form-grid" onSubmit={handleRequestOtp}>
        <input className="input" placeholder={t("voterId")} value={voterId} onChange={(e) => setVoterId(e.target.value)} required />
        <input className="input" type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="button-primary" type="submit">{t("requestOtp")}</button>
      </form>
      <p className="muted-text">{t("otpHint")}</p>
      {otpPreview ? <p className="success-text">Demo OTP: {otpPreview}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <p className="muted-text">No account? <Link to="/register">{t("register")}</Link></p>
    </section>
  );
};

export default LoginPage;
