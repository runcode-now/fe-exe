import axios from "axios";

const API_URL = "http://103.179.185.149:8435/api/Authentication";


export const login = async (email, password) => {
  try {
    console.log("API_URL", API_URL);
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.isValid; 
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};


export const register = async (email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { 
      email, 
      password, 
      confirmPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed!";
  }
};


export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reset link!";
  }
};


export const resetPassword = async (userId, token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { 
      userId, 
      token, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password!";
  }
};

export const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`http://103.179.185.149:8435/api/User/myInfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};