import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const TopBar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        {t("appTitle")}
      </Link>
      <div className="topbar-right">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <>
            <span className="role-chip">{role.toUpperCase()}</span>
            <button className="button-secondary" onClick={handleLogout}>
              {t("logout")}
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default TopBar;
