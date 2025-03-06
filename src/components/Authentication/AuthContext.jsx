import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo, validateToken } from "../../Service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: đang kiểm tra, true/false: đã xác thực
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Kiểm tra token khi ứng dụng khởi động
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          // Lấy thông tin người dùng
          const userData = await getUserInfo();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Đã kiểm tra xong
    };

    checkAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (token) => {
    localStorage.setItem("token", token);
    setLoading(true);
    try {
      const userData = await getUserInfo();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, setIsAuthenticated, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);