import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

const emptyParty = { name: "", symbol: "", description: "" };

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [parties, setParties] = useState([]);
  const [votes, setVotes] = useState([]);
  const [counts, setCounts] = useState([]);
  const [form, setForm] = useState(emptyParty);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [partiesRes, votesRes, countRes] = await Promise.all([
        apiClient.get("/parties"),
        apiClient.get("/votes"),
        apiClient.get("/votes/count"),
      ]);
      setParties(partiesRes.data);
      setVotes(votesRes.data);
      setCounts(countRes.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await apiClient.put(`/parties/${editingId}`, form);
      } else {
        await apiClient.post("/parties", form);
      }
      setForm(emptyParty);
      setEditingId("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save party");
    }
  };

  const handleDelete = async (partyId) => {
    try {
      await apiClient.delete(`/parties/${partyId}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete party");
    }
  };

  const startEdit = (party) => {
    setEditingId(party._id);
    setForm({ name: party.name, symbol: party.symbol, description: party.description || "" });
  };

  const totalVotesCast = votes.length;
  const electionStatus = "Active";

  const statCards = [
    {
      label: "Total Parties",
      value: parties.length,
      tone: "blue",
      icon: "👥",
    },
    {
      label: "Votes Cast",
      value: totalVotesCast,
      tone: "green",
      icon: "✅",
    },
    {
      label: "Election Status",
      value: electionStatus,
      tone: "violet",
      icon: "☰",
    },
  ];

  return (
    <section className="admin-dashboard-shell">
      <section className="admin-hero card">
        <div className="admin-hero-copy">
          <p className="admin-kicker">Admin Dashboard</p>
          <h2 className="admin-title">
            Welcome Back, {user?.name || "Admin"}
          </h2>
          <p className="admin-subtitle">
            Your voter ID: {user?.voterId || "ADMIN"}
          </p>
        </div>
        <div className="admin-status-pill">Status: Verified</div>
      </section>

      {error ? <p className="error-text">{error}</p> : null}

      <section className="admin-stats-grid">
        {statCards.map((stat) => (
          <article key={stat.label} className={`admin-stat-card tone-${stat.tone}`}>
            <div className="admin-stat-icon">{stat.icon}</div>
            <div>
              <p className="admin-stat-label">{stat.label}</p>
              <div className="admin-stat-value">{stat.value}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="card admin-section-card">
        <h3 className="section-title">Available Parties</h3>
        <div className="admin-party-grid">
        {parties.map((party) => (
          <article className="admin-party-card" key={party._id}>
            <div className="admin-party-badge">
              {(party.symbol || party.name || "?").slice(0, 1).toUpperCase()}
            </div>
            <h3>{party.name}</h3>
            <p>{party.description || "Leading voting option"}</p>
            <div className="admin-party-footer">
              <div className="admin-party-meta">Votes: {party.voteCount || 0}</div>
              <div className="button-row admin-card-actions">
                <button className="button-secondary" onClick={() => startEdit(party)}>
                  {t("editParty")}
                </button>
                <button className="button-danger" onClick={() => handleDelete(party._id)}>
                  {t("deleteParty")}
                </button>
              </div>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="card admin-section-card">
        <h3 className="section-title">Manage Parties</h3>
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <input className="input" placeholder={t("name")} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input className="input" placeholder={t("symbol")} value={form.symbol} onChange={(e) => setForm((prev) => ({ ...prev, symbol: e.target.value }))} required />
          <input className="input" placeholder={t("description")} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <button className="button-primary" type="submit">
            {editingId ? t("editParty") : t("addParty")}
          </button>
        </form>
      </section>

      <section className="card admin-section-card">
        <h3 className="section-title">Vote Summary</h3>
        <div className="admin-summary-grid">
          {counts.map((entry) => (
            <article className="admin-summary-card" key={entry._id}>
              <div className="admin-summary-name">{entry.name}</div>
              <div className="admin-summary-symbol">{entry.symbol}</div>
              <div className="admin-summary-count">{entry.voteCount}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="card admin-section-card">
        <h3 className="section-title">Votes List</h3>
        <ul className="admin-vote-list">
          {votes.map((vote) => (
            <li key={vote._id} className="admin-vote-item">
              <span>{vote.user?.name} ({vote.user?.voterId})</span>
              <span>{"->"}</span>
              <span>{vote.party?.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <button className="admin-logout-text" type="button" onClick={() => window.location.assign("/") }>
        ⎋ Logout
      </button>
    </section>
  );
};

export default AdminDashboard;
