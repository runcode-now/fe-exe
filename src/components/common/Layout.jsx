import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { SidebarProvider } from "./SidebarProvider";
import { useSidebar } from "./SidebarProvider";

const Layout = () => {
  const { isSidebarOpen } = useSidebar(); // Lấy trạng thái sidebar từ context

  return (
    <SidebarProvider>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Nội dung chính bên dưới Navbar */}
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              paddingLeft: isSidebarOpen ? "260px" : "78px", // Điều chỉnh padding dựa trên trạng thái sidebar
              backgroundColor: "#F5F5F7",
              p: 3,
              mt: "64px", // Đẩy nội dung xuống dưới Navbar (khoảng cách = chiều cao Navbar)
              transition: "padding-left 0.3s", // Hiệu ứng mượt mà khi sidebar thay đổi
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </SidebarProvider>
  );
};

export default Layout;