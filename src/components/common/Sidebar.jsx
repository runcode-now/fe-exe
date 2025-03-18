import React, { useState } from "react";
import { Box, Collapse } from "@mui/material";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TimelineIcon from "@mui/icons-material/Timeline";
import CampaignIcon from "@mui/icons-material/Campaign";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSidebar } from "./SidebarProvider";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../Authentication/AuthContext";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [openReports, setOpenReports] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleReports = () => {
    setOpenReports(!openReports);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Drawer
      sx={{
        width: isSidebarOpen ? 240 : 58,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 240 : 58,
          background: "linear-gradient(180deg, #f2683c 0%, #ff8c5a 100%)", // Gradient giống Navbar
          padding: "10px",
          transition: "width 0.3s ease", // Hiệu ứng mượt khi mở rộng/thu gọn
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // Thêm shadow nhẹ
          color: "#ffffff", // Màu chữ trắng
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isSidebarOpen ? "space-between" : "center",
          width: "100%",
          padding: "10px",
          minHeight: "64px", // Chiều cao cố định giống Navbar
        }}
      >
        {isSidebarOpen && (
          <Box
            component="img"
            src="https://res.cloudinary.com/dxm2j51zr/image/upload/v1739606800/Logo_iqslyp.jpg"
            alt="EventSet Logo"
            sx={{
              width: "auto",
              maxWidth: "180px",
              height: "auto",
              cursor: "pointer",
            }}
          />
        )}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "#ffffff",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {/* Dashboard */}
        <ListItem
          button
          onClick={toggleReports}
          sx={{
            borderRadius: "12px",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            padding: "12px 16px",
          }}
        >
          <ListItemIcon>
            <HomeIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Dashboard" />}
          {isSidebarOpen &&
            (openReports ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
        </ListItem>

        {/* Submenu Reports */}
        <Collapse in={isSidebarOpen && openReports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Home" ? "rgba(255, 255, 255, 0.3)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                borderRadius: "12px",
              }}
              onClick={() => {
                navigate("/");
                setActiveItem("Home");
              }}
            >
              <ListItemText primary="Home" />
            </ListItem>
            {/* <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Schedule" ? "rgba(255, 255, 255, 0.3)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                borderRadius: "12px",
              }}
              onClick={() => {
                setActiveItem("Schedule");
                navigate(`/schedule/${user.id}`);
                console.log(user.id);
                console.log("============================================================================");
              }}
            >
              <ListItemText primary="Schedule" />
            </ListItem>
            <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Analytic" ? "rgba(255, 255, 255, 0.3)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                borderRadius: "12px",
              }}
              onClick={() => setActiveItem("Analytic")}
            >
              <ListItemText primary="Analytic" />
            </ListItem> */}
          </List>
        </Collapse>

        {/* Email */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Email" ? "rgba(255, 255, 255, 0.3)" : "transparent",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            borderRadius: "12px",
            padding: "12px 16px",
          }}
          onClick={() => {
            setActiveItem("Email");
            navigate("/email");
          }}
        >
          <ListItemIcon>
            <MailOutlineIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Email" />}
        </ListItem>

        {/* Timeline */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Timeline" ? "rgba(255, 255, 255, 0.3)" : "transparent",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            borderRadius: "12px",
            padding: "12px 16px",
          }}
          onClick={() => setActiveItem("Timeline")}
        >
          <ListItemIcon>
            <TimelineIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Timeline" />}
        </ListItem>

        {/* Marketing */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Marketing" ? "rgba(255, 255, 255, 0.3)" : "transparent",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            borderRadius: "12px",
            padding: "12px 16px",
          }}
          onClick={() => setActiveItem("Marketing")}
        >
          <ListItemIcon>
            <CampaignIcon sx={{ color: "#ffffff" }} />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Marketing" />}
        </ListItem>

        {/* Emails (Placeholder) */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Emails" ? "rgba(255, 255, 255, 0.3)" : "transparent",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            borderRadius: "12px",
            padding: "12px 16px",
          }}
          onClick={() => setActiveItem("Emails")}
        >
          {/* Có thể thêm icon hoặc text nếu cần */}
        </ListItem>
      </List>

      {/* Logout (Đặt ở dưới cùng) */}
      <List sx={{ mt: "auto" }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            borderRadius: "12px",
            padding: "12px 16px",
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#ff4d4d" }} /> {/* Màu đỏ nổi bật */}
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Logout" sx={{ color: "#ff4d4d" }} />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;