import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  CardMedia,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash/debounce";
import { useAuth } from "../Authentication/AuthContext";

const Homee = ({ onEventJoined }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Lấy user từ AuthContext

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorStatus, setCreatorStatus] = useState({}); // Lưu trạng thái creator cho từng sự kiện
  const [error, setError] = useState("");

  // Hàm để lấy danh sách sự kiện
  const fetchEvents = useCallback(async () => {
    if (!user?.id) {
      setError("User not authenticated.");
      return;
    }

    try {
      // Gọi API để lấy danh sách sự kiện của người dùng
      const response = await axios.post(
        `http://103.179.185.149:8435/api/EventParticipant/GetEventsByUserId?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data.data;

      if (data) {
        setEvents(data);

        // Kiểm tra quyền creator cho từng sự kiện
        const creatorChecks = await Promise.all(
          data.map(async (event) => {
            const checkResponse = await axios.post(
              "http://103.179.185.149:8435/api/EventParticipant/CheckMakeEvent",
              { EventId: event.eventId, UserId: user.id },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return { eventId: event.eventId, isCreator: checkResponse.data.Data };
          })
        );

        const creatorMap = creatorChecks.reduce((acc, { eventId, isCreator }) => {
          acc[eventId] = isCreator;
          return acc;
        }, {});
        setCreatorStatus(creatorMap);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err.response.data);
      setError(err.response?.data?.Message || "Failed to fetch events.");
    }
  }, [user]);

  // Gọi fetchEvents khi component mount hoặc khi user hoặc location.state thay đổi
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, user, location.state]);

  // Cập nhật danh sách sự kiện lọc khi events thay đổi
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // Xử lý thông báo từ location.state
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      navigate("/", { replace: true, state: {} });
    }

    if (location.state?.eventDeleted) {
      toast.success("Event deleted successfully!");
      navigate("/", { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Hàm tìm kiếm với debounce
  const debouncedSearch = debounce((query) => {
    if (!query) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) =>
      event.eventName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Hàm lấy hình ảnh dựa trên loại sự kiện
  const getEventImage = (eventType) => {
    switch (eventType) {
      case "Workshop":
        return "/CommonImg/Workshop.jpg";
      case "Seminar":
        return "/CommonImg/Seminar.jpg";
      case "Entertainment":
        return "/CommonImg/Entertainment.jpg";
      case "Team Building":
        return "/CommonImg/TeamBuilding.jpg";
      case "Product Launch":
        return "/CommonImg/ProductLaunch.jpg";
      case "Sports":
        return "/CommonImg/Sports.jpg";
      case "eSports":
        return "/CommonImg/eSports.jpg";
      default:
        return "/CommonImg/Custom.jpg";
    }
  };

  // Expose fetchEvents as a callback for Navbar to trigger refresh
  useEffect(() => {
    if (onEventJoined) {
      fetchEvents();
    }
  }, [onEventJoined, fetchEvents]);

  return (
    <div
      style={{
        transition: "transform 0.7s ease",
        width: "90%",
        minHeight: "100vh",
        margin: "0 auto",
        marginTop: "80px", // Adjusted for Navbar height
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {/* Header với nút Create Event và Search */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          display: "flex",
        }}
      >
        <div style={{ display: "flex", justifyContent: "start", width: "50%" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#207BF5",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#004AAD",
              },
            }}
            onClick={() => navigate("/createEvent")}
          >
            Create Event
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "end", width: "50%" }}>
          <TextField
            label="Search Events"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                width: "100%",
                borderRadius: "12px",
                "& fieldset": { borderColor: "#FF5722" },
                "&:hover fieldset": { borderColor: "#FF5722" },
                "&.Mui-focused fieldset": { borderColor: "#FF5722" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon sx={{ color: "#FF5722" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {/* Divider */}
      <Divider
        sx={{
          borderStyle: "borderColor",
          borderWidth: 1,
          marginY: 4,
        }}
      />

      {/* Hiển thị danh sách sự kiện */}
      {error ? (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No matching events found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={3} key={event.eventId}>
              <Card
                sx={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                    backgroundColor: "#f5f5f5",
                  },
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
                  width: "100%",
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  alt={event.eventName}
                  image={getEventImage(event.categoryName)}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "160px",
                  }}
                />
                <CardContent style={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    color="info"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {event.eventName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Date: {new Date(event.startDate).toLocaleDateString()}
                  </Typography>
                </CardContent>

                {/* Nút Edit nếu người dùng là creator */}
                {creatorStatus[event.eventId] && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click vào Card
                      navigate(`/editEvent/${event.eventId}`); // Điều hướng đến trang chỉnh sửa
                    }}
                  >
                    Edit
                  </Button>
                )}

                {/* Nút xem chi tiết sự kiện - Được căn giữa */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pb: 2, // Padding bottom tương đương 16px
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/displayEvent/${event.eventId}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Homee;