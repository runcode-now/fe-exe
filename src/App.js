import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import { SidebarProvider } from "./components/common/SidebarProvider";
import ComRoutes from "./components/routes/ComRoutes";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import Logout from "./components/Authentication/Logout";
import { AuthProvider, useAuth } from "./components/Authentication/AuthContext";
import ChatBoxContainer from "./components/chatbox/ChatBoxContainer";
import { Email } from "@mui/icons-material";
import EmailBox from "./components/email/EmailBox";

const GOOGLE_MAPS_API_KEY = "AIzaSyA1m9VQIw8SfC5jYRvgIZeIweHBoW7y7WI";
const GOOGLE_MAPS_LIBRARIES = ["places"];

const App = () => {
  return (
    <AuthProvider>
      {/* <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}> */}
        <BrowserRouter>
          <ProtectedApp />
        </BrowserRouter>
      {/* </LoadScript> */}
    </AuthProvider>
  );
};

const ProtectedApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <SidebarProvider>
                <ComRoutes />
              </SidebarProvider>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      {/* Đặt ChatBoxContainer ngoài Routes để hiển thị trên mọi trang */}
      <ChatBoxContainer /> 
    </>
  );
};

export default App;