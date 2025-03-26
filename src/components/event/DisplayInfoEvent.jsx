import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../Authentication/AuthContext";

const DisplayInfoEvent = () => {
  const [event, setEvent] = useState(null);
  const { user } = useAuth(); // Lấy user từ AuthContext
  // State để lưu dữ liệu user
  const { eventId } = useParams(); // Lấy cả id và userId từ URL
  const navigate = useNavigate();

  const userIdd = user.id; // thang k tao ra
  const [checkMakeEvent, setCheckMakeEvent] = useState({
    EventId: eventId,
    UserId: userIdd,
  });

  const navigateTo = useCallback(
    (type) => {
      switch (type) {
        case "make plan":
          navigate(`/plan/${eventId}`);
          break;
        case "agenda":
          navigate(`/schedule-detail/${eventId}`);
          break;
        case "make agenda":
          navigate(`/agenda/${eventId}`);

          break;
        default:
          navigate("/default");
      }
    },
    [navigate]
  );

  //   const userId = "478075a3-eeb0-4b8d-b41e-4fa89be24e0b"; // thang  tao ra
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://103.179.185.149:8435/api/Event/getByEventId/${eventId}`
        );
        setEvent(response.data.data); // Giả sử API trả về object event
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://103.179.185.149:8435/api/EventParticipant/CheckMakeEvent",
          checkMakeEvent
        );
        setCheckMakeEvent(response.data.data); // Cẩn thận: đảm bảo response.data.data là object với EventId và UserId
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };

    if (userIdd) {
      fetchUserData();
    }
  }, [eventId, userIdd]);

  const handleDeleteEvent = async (eventId) => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to delete event " + event.eventName
        )
      ) {
        return;
      }

      await axios.delete(`http://103.179.185.149:8435/api/Event/delete/${eventId}`);

      // Chuyển hướng về trang Home và truyền state
      navigate("/", { state: { eventDeleted: true } });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };
  if (!event)
    return (
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          fontSize: "20px",
          color: "#797979",
        }}
      >
        Wait a minute...
      </Typography>
    );

  const dateRange = () => {
    if (!event.startDate) return "Not specified";
    try {
      const start = new Date(event.startDate);
      if (isNaN(start.getTime())) return "Invalid Date"; // Kiểm tra nếu ngày không hợp lệ
      const formattedStart = start.toLocaleDateString();
      if (event.endDate) {
        const end = new Date(event.endDate);
        if (isNaN(end.getTime())) return formattedStart; // Chỉ hiển thị start nếu end không hợp lệ
        return `${formattedStart} - ${end.toLocaleDateString()}`;
      }
      return formattedStart;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        sx={{ marginTop: "20px", marginLeft: "65px", borderRadius: "8px" }}
        onClick={() => navigate("/")}
      >
        Back to home
      </Button>
      <Box
        sx={{
          padding: "40px 20px",
          background: "#F2F2F7",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {event ? (
          <>
            {/* Header Section */}
            <Box
              sx={{
                maxWidth: "900px",
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                mb: 4,
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#2c3e50",
                  mb: 2,
                  maxWidth: "900px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {event.eventName}
              </Typography>

              {checkMakeEvent === true && (
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Event Code:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {event.eventCode !== null && event.eventCode !== undefined
                        ? event.eventCode
                        : "No code available"}
                    </span>
                  </Typography>
                </Grid>
              )}
              <Divider
                sx={{ borderStyle: "borderColor", borderWidth: 2, my: 3 }}
              />
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Date:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {dateRange()}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Participants:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {event.participantCount !== null &&
                      event.participantCount !== undefined
                        ? event.participantCount
                        : "N/A"}
                    </span>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Concept:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {event.concept !== null && event.concept !== undefined
                        ? event.concept
                        : "N/A"}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Dress Code:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {event.dressCode !== null && event.dressCode !== undefined
                        ? event.dressCode
                        : "N/A"}
                    </span>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                  >
                    Location:{" "}
                    <span
                      style={{ color: "rgb(100 100 100)", fontWeight: "bold" }}
                    >
                      {event.location !== null && event.location !== undefined
                        ? event.location
                        : "N/A"}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
              {checkMakeEvent === true && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteEvent(eventId)}
                  >
                    Delete Event
                  </Button>
                </Grid>
              )}
            </Box>

            {/* Explore More Event Types Section */}
            <Box
              sx={{
                maxWidth: "900px",
                width: "100%",
                textAlign: "center",
                mt: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "#2c3e50", fontWeight: "bold", mb: 4 }}
              >
                Explore More
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {["make plan", "agenda", "make agenda"].map((type) => (
                  <Grid item xs={12} sm={4} key={type}>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#4C4E6414",
                        height: "250px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                          backgroundColor: "#dcdde1",
                        },
                        cursor: "pointer",
                        p: 2,
                      }}
                      onClick={() => navigateTo(type)}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          sx={{ color: "#2c3e50", fontWeight: "bold", mb: 2 }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: "#7f8c8d", fontStyle: "italic" }}
                        >
                          Know more →
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </>
  );
};

export default DisplayInfoEvent;
