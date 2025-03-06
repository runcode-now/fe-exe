import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");

    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  }, [navigate]);

  return null; // Không cần hiển thị gì trên màn hình
};

export default Logout;
