import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => setLoading(false)); // Stop loading after data fetch
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("User data:", response.data); 
        localStorage.setItem("UserId", response.data._id); 
        setUser(response.data);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
        setUser(null);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const userRole = user?.role;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
