import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Set default headers for axios
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth?.token ? `Bearer ${auth.token}` : "";
  }, [auth?.token]);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);

  return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
