import React, { useState } from "react";
import { Box, Button, TextField, Modal, Typography, IconButton } from "@mui/material";
import { useAuth } from "../Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import EventIcon from "@mui/icons-material/Event"; // Icon cho Join Event
import CloseIcon from "@mui/icons-material/Close"; // Icon cho Close
import WebIcon from "@mui/icons-material/Web"; // Icon cho website
import LoginIcon from "@mui/icons-material/Login"; // Icon cho Join

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450, // Tăng chiều rộng cho không gian thoải mái hơn
  bgcolor: "background.paper",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)", // Shadow mềm hơn
  p: 4,
  borderRadius: "12px", // Bo góc lớn hơn
  border: "1px solid #e0e0e0", // Thêm viền nhẹ
};

const Navbar = ({ onEventJoined }) => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [eventCode, setEventCode] = useState("");
  const [error, setError] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEventCode("");
    setError("");
  };

  const handleJoinEvent = async () => {
    if (!eventCode) {
      setError("Please enter a valid event code.");
      return;
    }

    try {
      const response = await axios.post("http://103.179.185.149:8435/api/EventParticipant/JoinEvent", {
        EventCode: eventCode,
        UserId: user?.id,
      });

      toast.success(response.data.message, { autoClose: 2000 }); // Toast với thời gian đóng nhanh hơn
      handleCloseModal();
      if (onEventJoined) {
        onEventJoined();
      }
    } catch (err) {
      setError(err.response?.data?.Message || "Event does not exist.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #f2683c 0%, #ff8c5a 100%)", // Gradient cho navbar
        padding: "15px 40px", // Tăng padding ngang
        zIndex: 1200,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)", // Shadow đậm hơn
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Button
          variant="contained"
          startIcon={<EventIcon />}
          sx={{
            backgroundColor: "#ffffff",
            color: "#f2683c",
            padding: "10px 28px",
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#f5f5f5",
              color: "#d95f32",
              transform: "scale(1.05)", // Hiệu ứng phóng to nhẹ
              transition: "all 0.3s ease",
            },
          }}
          onClick={handleOpenModal}
        >
          Join Event
        </Button>

        {/* Link to Website */}
        <Button
          variant="outlined"
          startIcon={<WebIcon />}
          href="https://www.facebook.com/toivagiadinh68" // Thay bằng URL thực tế
          target="_blank"
          sx={{
            color: "#ffffff",
            borderColor: "#ffffff",
            padding: "8px 20px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#f5f5f5",
              transform: "translateY(-2px)",
              transition: "all 0.3s ease",
            },
          }}
        >
          Visit Page
        </Button>
      </Box>

      {/* Right Section */}
      <Typography
        sx={{
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {user?.email || "Guest"}
      </Typography>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#f2683c", marginLeft: "30px" }}>
              Join an Event
            </Typography>
            <IconButton onClick={handleCloseModal} sx={{ color: "#f2683c" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Enter event code"
            value={eventCode}
            onChange={(e) => {
              setEventCode(e.target.value);
              setError("");
            }}
            sx={{ mb: 3 }}
            error={!!error}
            helperText={error}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleJoinEvent}
              sx={{
                backgroundColor: "#f2683c",
                padding: "10px 24px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#d95f32",
                  transform: "scale(1.05)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Join Now
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              sx={{
                padding: "10px 24px",
                borderRadius: "8px",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Navbar;