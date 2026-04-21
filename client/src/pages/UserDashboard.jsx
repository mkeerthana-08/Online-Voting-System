import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import apiClient from "../api/apiClient";

const UserDashboard = () => {
  const { t } = useTranslation();
  const [parties, setParties] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [partiesRes, statusRes] = await Promise.all([
        apiClient.get("/parties"),
        apiClient.get("/votes/me/status"),
      ]);
      setParties(partiesRes.data);
      setHasVoted(statusRes.data.hasVoted);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVote = async (partyId) => {
    try {
      await apiClient.post("/votes", { partyId });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Vote failed");
    }
  };

  return (
    <section className="card wide-card">
      <h2>{t("userDashboard")}</h2>
      {error ? <p className="error-text">{error}</p> : null}
      {hasVoted ? (
        <div className="vote-complete-box">
          <h3>{t("voted")}</h3>
          <p>You already voted. You can close this tab.</p>
        </div>
      ) : (
        <div className="party-grid">
          {parties.length === 0 ? <p>{t("noData")}</p> : null}
          {parties.map((party) => (
            <article className="party-card" key={party._id}>
              <h3>{party.name}</h3>
              <p><strong>{t("symbol")}:</strong> {party.symbol}</p>
              <p>{party.description}</p>
              <button className="button-primary" onClick={() => handleVote(party._id)}>
                {t("voteNow")}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default UserDashboard;
