import React, { useState } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import { useAuth } from "../Authentication/AuthContext";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for consistent notifications

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
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

      toast.success(response.data.message); // Use toast instead of alert
      handleCloseModal();
      
      // Trigger the callback to refresh the event list in Homee
      if (onEventJoined) {
        onEventJoined();
      }
    } catch (err) {
      setError(err.response?.data?.Message || "Event exist.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ff5722",
        padding: "10px 20px",
        zIndex: 1200,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
      }}
    >
      <Box sx={{ marginLeft: "60px" }}>
        <img
          src="https://res.cloudinary.com/dxm2j51zr/image/upload/v1739606800/Logo_iqslyp.jpg"
          alt="EventSet Logo"
          style={{ height: "40px" }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4caf50",
            color: "white",
            "&:hover": {
              backgroundColor: "#388e3c",
            },
          }}
          onClick={handleOpenModal}
        >
          Join Event
        </Button>
      </Box>

      <Typography sx={{ color: "white", fontSize: "14px", marginRight: "20px" }}>
        {user?.email || "Guest"}
      </Typography>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Join Event
          </Typography>
          <TextField
            fullWidth
            label="Enter event code"
            value={eventCode}
            onChange={(e) => {
              setEventCode(e.target.value);
              setError("");
            }}
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" onClick={handleJoinEvent}>
              Join
            </Button>
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Navbar;