import React, { use, useState } from "react";
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
// import { SiOpenai } from "react-icons/si";
import { useAuth } from "../Authentication/AuthContext";
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar(); // Lấy từ SidebarContext
  const [openReports, setOpenReports] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const {user} = useAuth();

  const toggleReports = () => {
    setOpenReports(!openReports); // Chuyển đổi trạng thái của submenu Reports
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <Drawer
      sx={{
        width: isSidebarOpen ? 240 : 58, // Sidebar rộng khi mở và thu nhỏ khi đóng
        backgroundColor: "#ffffff",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 240 : 58,
          backgroundColor: "#ffffff",
          padding: "10px",

          // transition: "transform 1s ease",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Nút toggle ở trên đầu */}

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
        {/* Logo */}
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

        {/* Nút Menu */}
        <IconButton
          button="true"
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
      <List>
        <ListItem
          button="true"
          onClick={() => {
            toggleReports(); // Giữ logic mở/đóng submenu
          }}
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

        <Collapse
          in={isSidebarOpen && openReports}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItem
              button="true"
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Home" ? "#F15A24" : "transparent",
                cursor: "pointer",
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
            {/* <ListItem
              button="true"
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Schedule" ? "#F15A24" : "transparent",
                "&:hover": { backgroundColor: "#4C4E641F" },
                color: activeItem === "Schedule" ? "#4C4E641F" : "#cbcbcb",
                cursor: "pointer",
                borderRadius: "12px",
              }}
              onClick={() => {
                setActiveItem("Schedule");
                navigate(`/schedule/${user.id}`); 
                console.log(user.id);
                console.log("============================================================================");
              }}
            >
              <ListItemText
                primary="Schedule"
                sx={{ color: activeItem === "Schedule" ? "#FFF" : "#4C4E64DE" }}
              />
            </ListItem>
            <ListItem
              button="true"
              sx={{
                pl: 4,
                backgroundColor:
                  activeItem === "Analytic" ? "#F15A24" : "transparent",
                "&:hover": { backgroundColor: "#4C4E641F" },
                color: activeItem === "Analytic" ? "#FFF" : "#757575",
                cursor: "pointer",
                borderRadius: "12px",
              }}
              onClick={() => setActiveItem("Analytic")}
            >
              <ListItemText
                primary="Analytic"
                sx={{ color: activeItem === "Analytic" ? "#FFF" : "#4C4E64DE" }}
              />
            </ListItem> */}
          </List>
        </Collapse>

        <ListItem
          button="true"
          sx={{
            backgroundColor:
              activeItem === "Email" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            color: activeItem === "Email" ? "#FFF" : "#757575",
            fontSize: "21px",
            cursor: "pointer",
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

        {/* <ListItem
          button
          sx={{
            mb: 1,
            backgroundColor: activeItem === "Inbox" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            color: activeItem === "Inbox" ? "#FFF" : "#757575",
            cursor: "pointer",
            borderRadius: "12px",
          }}
          onClick={() => {
            setActiveItem("Inbox");
            navigate("/displayEvent");
          }}
        >
          <ListItemIcon>
            <InboxIcon
              sx={{ color: activeItem === "Inbox" ? "#FFF" : "#4C4E64DE" }}
            />
          </ListItemIcon>
          {isSidebarOpen && (
            <ListItemText
              primary="Inbox"
              sx={{ color: activeItem === "Inbox" ? "#FFF" : "#4C4E64DE" }}
            />
          )}
        </ListItem> */}

        <ListItem
          button="true"
          sx={{
            backgroundColor:
              activeItem === "Timeline" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            color: activeItem === "Timeline" ? "#FFF" : "#757575",
            cursor: "pointer",
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
        </ListItem>

        <ListItem
          button="true"
          sx={{
            mb: 1,
            backgroundColor:
              activeItem === "Marketing" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            color: activeItem === "Marketing" ? "#FFF" : "#757575",
            cursor: "pointer",
            borderRadius: "12px",
          }}
          onClick={() =>{
            setActiveItem("Marketing")
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

        <ListItem
          button="true"
          sx={{
            backgroundColor:
              activeItem === "Emails" ? "#F15A24" : "transparent",
            "&:hover": { backgroundColor: "#4C4E641F" },
            color: activeItem === "Emails" ? "#FFF" : "#757575",
            cursor: "pointer",
            borderRadius: "12px",
          }}
          onClick={() => setActiveItem("Emails")}
        >
   
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          {isSidebarOpen && <ListItemText primary="Logout" sx={{ color: "red" }} />}
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebar;
