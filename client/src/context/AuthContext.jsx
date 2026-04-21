import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  return {
    token: token || "",
    role: role || "",
    user: user ? JSON.parse(user) : null,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = ({ token, role, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, role, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setAuth({ token: "", role: "", user: null });
  };

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
