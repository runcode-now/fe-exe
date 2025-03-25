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
import ContactsIcon from "@mui/icons-material/Contacts";

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
        width: isSidebarOpen ? 260 : 58,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 260 : 58,
          backgroundColor: "#ffffff",
          padding: "10px",
          height: "100vh", // Giới hạn chiều cao bằng màn hình
          marginTop: "80px", // Thêm margin-top 80px
          overflowY: "hidden", // Bỏ thanh cuộn dọc
          overflowX: "hidden", // Bỏ thanh cuộn ngang
          boxSizing: "border-box", // Đảm bảo padding không làm vượt kích thước
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
          width: "100%",
          position: "relative",
          margin: "10px",
          cursor: "pointer",
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
            position: "absolute",
            transition: "left 0.3s",
            marginRight: "10px",
            right: "10px",
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
            "&:hover": { backgroundColor: "#4C4E641F" },
            cursor: "pointer",
            borderRadius: "12px",
          }}
        >
          <ListItemIcon>
            <HomeIcon
              sx={{ color: activeItem === "Dashboard" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Dashboard"
              sx={{ color: activeItem === "Dashboard" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
          {openReports ? (
            <ExpandLessIcon
              sx={{ color: activeItem === "Dashboard" ? "#FFF" : "#4C4E64DE" }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{ color: activeItem === "Dashboard" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem>

        {/* Submenu Reports */}
        <Collapse
          in={isSidebarOpen && openReports}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Home" ? "#F15A24" : "transparent",
                "&:hover": { backgroundColor: "#4C4E641F" },
                borderRadius: "12px",
              }}
              onClick={() => {
                navigate("/");
                setActiveItem("Home");
              }}
            >
              <ListItemText
                primary="Home"
                sx={{ color: activeItem === "Home" ? "#FFF" : "#4C4E64DE" }}
              />
            </ListItem>
            <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Schedule" ? "#F15A24" : "transparent",
                "&:hover": { backgroundColor: "#4C4E641F" },
                borderRadius: "12px",
              }}
              onClick={() => {
                setActiveItem("Schedule");
                navigate(`/schedule/${user.id}`);
                console.log(user.id);
                console.log(
                  "============================================================================"
                );
              }}
            >
              <ListItemText
                primary="Schedule"
                sx={{ color: activeItem === "Schedule" ? "#FFF" : "#4C4E64DE" }}
              />
            </ListItem>
            {/* <ListItem
              button
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Analytic" ? "#F15A24" : "transparent",
                "&:hover": { backgroundColor: "#4C4E641F" },
                borderRadius: "12px",
              }}
              onClick={() => setActiveItem("Analytic")}
            >
              <ListItemText
                primary="Analytic"
                sx={{ color: activeItem === "Analytic" ? "#FFF" : "#4C4E64DE" }}
              /> 
            </ListItem>  */}
          </List>
        </Collapse>

        {/* Email */}
        <ListItem
          button
          sx={{
            backgroundColor: activeItem === "Email" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            borderRadius: "12px",
          }}
          onClick={() => {
            setActiveItem("Email");
            navigate("/email");
          }}
        >
          <ListItemIcon>
            <MailOutlineIcon
              sx={{ color: activeItem === "Email" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Email"
              sx={{ color: activeItem === "Email" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem>

        {/* Timeline */}
        {/* <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Timeline" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            borderRadius: "12px",
          }}
          onClick={() => setActiveItem("Timeline")}
        >
          <ListItemIcon>
            <TimelineIcon
              sx={{ color: activeItem === "Timeline" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Timeline"
              sx={{ color: activeItem === "Timeline" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem> */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Supplier" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            borderRadius: "12px",
          }}
          onClick={() => {
            setActiveItem("Supplier");
            navigate("/supplier");
          }}
        >
          <ListItemIcon>
            <ContactsIcon
              sx={{ color: activeItem === "Supplier" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Supplier"
              sx={{ color: activeItem === "Supplier" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem>
        {/* Marketing */}
        <ListItem
          button
          sx={{
            mb: 1,
            backgroundColor:
              activeItem === "Marketing" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            borderRadius: "12px",
          }}
          onClick={() => {
            setActiveItem("Marketing");
            window.location.href = "https://www.facebook.com/toivagiadinh68";
          }}
        >
          <ListItemIcon>
            <CampaignIcon
              sx={{ color: activeItem === "Marketing" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Marketing"
              sx={{ color: activeItem === "Marketing" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem>

        {/* Emails (Placeholder) */}
        <ListItem
          button
          sx={{
            backgroundColor:
              activeItem === "Emails" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            borderRadius: "12px",
          }}
          onClick={() => setActiveItem("Emails")}
        >
          {/* Có thể thêm nội dung nếu cần */}
        </ListItem>

        {/* Logout */}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            mt: "auto", // Đẩy xuống dưới cùng
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText primary="Logout" sx={{ color: "red" }} />
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
