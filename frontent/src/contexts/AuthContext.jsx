import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← yangi
  const token = localStorage.getItem("token");

  // Backenddan to‘liq user ma'lumotlarini yuklash
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`, // ← bu endpointni backendda qo'shing
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser(res.data.user || res.data); // backend qanday qaytarsa shunday
    } catch (error) {
      console.error("User yuklashda xatolik:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sahifa yuklanganda user ni yuklaymiz
  useEffect(() => {
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      { email, password },
    );
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (email, username, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      { email, username, password },
    );
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
