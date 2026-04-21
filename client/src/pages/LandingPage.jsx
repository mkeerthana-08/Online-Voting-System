import { Link } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Vote X: Online Voting System";
  }, []);

  return (
    <section className="landing-page">
      <div className="landing-glow landing-glow-a" />
      <div className="landing-glow landing-glow-b" />
      <div className="landing-card">
        <div className="landing-logo" aria-hidden="true">
          <div className="landing-logo-core" />
        </div>
        <h1 className="landing-title">Online Voting System</h1>
        <p className="landing-subtitle">
          Secure, simple, and multilingual voting platform.
        </p>
        <div className="landing-actions">
          <Link className="button-primary landing-button" to="/login">
            Enter App
          </Link>
          <Link className="button-secondary landing-button" to="/register">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
