import { useState } from "react";
import { useTranslation } from "react-i18next";

import apiClient from "../api/apiClient";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  voterId: "",
  aadhaar: "",
  password: "",
  role: "user",
};

const RegisterPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await apiClient.post("/auth/register", form);
      setMessage(data.message);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="card">
      <h2>{t("register")}</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input className="input" name="name" placeholder={t("name")} value={form.name} onChange={handleChange} required />
        <input className="input" name="email" type="email" placeholder={t("email")} value={form.email} onChange={handleChange} required />
        <input className="input" name="phone" placeholder={t("phone")} value={form.phone} onChange={handleChange} required />
        <input className="input" name="voterId" placeholder={t("voterId")} value={form.voterId} onChange={handleChange} required />
        <input className="input" name="aadhaar" placeholder={t("aadhaar")} value={form.aadhaar} onChange={handleChange} required />
        <input className="input" name="password" type="password" placeholder={t("password")} value={form.password} onChange={handleChange} required />
        <select className="input" name="role" value={form.role} onChange={handleChange}>
          <option value="user">{t("user")}</option>
          <option value="admin">{t("admin")}</option>
        </select>
        <button className="button-primary" type="submit">{t("submit")}</button>
      </form>
      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
};

export default RegisterPage;
