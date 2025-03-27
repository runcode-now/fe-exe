import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
// dsa
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextureIcon from "@mui/icons-material/Texture";
import EventIcon from "@mui/icons-material/Event";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate, useParams } from "react-router-dom"; // Để lấy eventId từ URL
import axios from "axios"; // Để gọi API
import { toast, ToastContainer } from "react-toastify"; // Để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css";

const Agenda = () => {
  const { eventId } = useParams(); // Lấy eventId từ URL (ví dụ: /agenda/:eventId)
  const [event, setEvent] = useState(null); // Lưu thông tin sự kiện
  const [agenda, setAgenda] = useState([]); // Khởi tạo danh sách agenda rỗng
  const [loading, setLoading] = useState(true); // State để kiểm tra loading
  const [error, setError] = useState(null); // State để xử lý lỗi
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  // Lấy thông tin sự kiện và danh sách agenda từ API khi component mount
  useEffect(() => {
    const fetchEventAndAgendas = async () => {
      try {
        // Lấy thông tin sự kiện theo eventId
        const eventResponse = await axios.get(
          `http://103.179.185.149:8435/api/Event/getByEventId/${eventId}`
        );
        setEvent(eventResponse.data.data); // Giả sử API trả về { message: "...", data: {...} }

        // Lấy danh sách agenda theo eventId
        const agendaResponse = await axios.get(
          `http://103.179.185.149:8435/api/Agenda/getByEvent/${eventId}`
        );

        // Kiểm tra và log dữ liệu chi tiết để debug

        // Parse danh sách agenda, đảm bảo xử lý lỗi và định dạng TimeSpan

        const parsedAgendas = Array.isArray(agendaResponse.data.data)
          ? agendaResponse.data.data.map((item) => {
              return {
                agendaId: item.agendaId || null,
                startTime: item.timeStart
                  ? parseTimeSpanToDayjs(item.timeStart)
                  : null, // Sử dụng "timeStart"
                endTime: item.timeEnd
                  ? parseTimeSpanToDayjs(item.timeEnd)
                  : null, // Sử dụng "timeEnd"
                description: item.description || "",
                eventId: item.eventId,
              };
            })
          : [];
        setAgenda(parsedAgendas);
      } catch (error) {
        console.error("Error fetching event or agendas:", error);
        setEvent(null);
        setAgenda([]); // Đặt agenda rỗng nếu có lỗi
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventAndAgendas();
    } else {
      setError("No event ID provided.");
      setLoading(false);
    }
  }, [eventId, refreshKey]);

  // Log state agenda sau khi cập nhật để kiểm tra
  useEffect(() => {}, [agenda]);

  // Hàm parse TimeSpan từ C# (ví dụ: "08:00:00" hoặc "22:00:00") thành dayjs object
  const parseTimeSpanToDayjs = (timeSpan) => {
    if (!timeSpan || timeSpan.trim() === "") return null;
    // Xử lý định dạng "HH:mm:ss"
    const timeParts = timeSpan.split(":");
    let hours,
      minutes,
      seconds = 0;
    if (timeParts.length === 3) {
      [hours, minutes, seconds] = timeParts.map(Number);
    } else {
      console.warn("Invalid TimeSpan format, expected 'HH:mm:ss':", timeSpan);
      return null;
    }
    // Kiểm tra tính hợp lệ
    if (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59 &&
      seconds >= 0 &&
      seconds <= 59
    ) {
      // Tạo dayjs object chỉ với thời gian, không có ngày cụ thể (dùng ngày cố định 01/01/1970)
      return dayjs("1970-01-01")
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds)
        .set("millisecond", 0);
    }
    return null;
  };

  // Hàm chuyển đổi dayjs object thành TimeSpan cho C# (ví dụ: 08:00 AM -> "08:00:00")
  const formatDayjsToTimeSpan = (dayjsTime) => {
    if (!dayjsTime) return null;
    const hours = dayjsTime.hour();
    const minutes = dayjsTime.minute();
    const seconds = dayjsTime.second();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Thêm một sự kiện mới vào agenda
  const handleAddEvent = () => {
    setAgenda([
      ...agenda,
      {
        agendaId: null,
        startTime: null,
        endTime: null,
        description: "",
        eventId: eventId,
      },
    ]);
  };

  // Cập nhật time hoặc description cho mỗi sự kiện
  const handleChange = (index, field, value) => {
    const updatedAgenda = [...agenda];
    updatedAgenda[index][field] = value; // Giá trị có thể là dayjs hoặc string cho description
    setAgenda(updatedAgenda);
  };

  // Xóa một sự kiện khỏi danh sách
  const handleDeleteEvent = (index) => {
    const updatedAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(updatedAgenda);
  };

  // Lưu toàn bộ danh sách agenda lên API, chuyển đổi thời gian thành TimeSpan cho C#

  // Cập nhật handleSaveAll để gửi AgendaId

  const handleSaveAll = async () => {
    try {
      // Kiểm tra nếu danh sách agenda rỗng
      if (!agenda || agenda.length === 0) {
        toast.error("No agendas to save. Please add at least one time slot.");
        return;
      }

      // Kiểm tra nếu có bất kỳ agenda nào thiếu thông tin bắt buộc
      const invalidAgenda = agenda.some(
        (item) => !item.startTime || !item.endTime || !item.description.trim()
      );

      if (invalidAgenda) {
        toast.error("Please fill in all required fields before saving.");
        return;
      }

      const payload = agenda.map((item) => ({
        AgendaId: item.agendaId || null, // Gửi AgendaId (null cho bản ghi mới)
        TimeStart: item.startTime
          ? formatDayjsToTimeSpan(item.startTime) + ""
          : null, // Chuyển thành "HH:mm:ss"
        TimeEnd: item.endTime ? formatDayjsToTimeSpan(item.endTime) + "" : null, // Chuyển thành "HH:mm:ss"
        Description: item.description || null,
        EventId: eventId,
      }));

      const response = await axios.post(
        `http://103.179.185.149:8435/api/Agenda/saveAll/${eventId}`, // Sử dụng endpoint mới với eventId trong URL
        payload // Gửi payload là danh sách các agenda với AgendaId
      );
      setRefreshKey((prevKey) => prevKey + 1); // 👈 Tăng `refreshKey` để trigger `useEffect`
      toast.success("Agendas saved successfully!");
    } catch (error) {
      console.error("Error saving agendas:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.Message ||
          "Failed to save agendas. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save agendas. Please try again");
      }
    }
  };

  if (loading)
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
        Loading agendas...
      </Typography>
    );
  if (error)
    return (
      <Typography
        color="error"
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          fontSize: "20px",
        }}
      >
        {error}
      </Typography>
    );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        variant="outlined"
        color="warning"
        sx={{ marginTop: "20px", marginLeft: "65px", borderRadius: "8px" }}
        onClick={() => navigate(`/displayEvent/${event.eventId}`)}
      >
        Back to display event
      </Button>
      <Box
        sx={{
          padding: "60px",
          maxWidth: "80%",
          margin: "auto",
          marginY: "20px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)",
          minHeight: "100vh",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />

        <Typography
          variant="h4"
          color="secondary"
          textAlign="center"
          fontWeight="bold"
        >
          Agenda
        </Typography>

        {/* Hiển thị thông tin sự kiện từ API */}
        <Grid
          container
          spacing={2}
          sx={{ color: "#4C4E64DE", fontWeight: "bolder", marginTop: "5px" }}
        >
          <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
            <TextureIcon
              style={{ color: "rgb(46, 192, 255)", fontWeight: "bolder" }}
            />
            <Typography
              variant="h6"
              sx={{
                textAlign: "start",
                marginLeft: "5px",
                overflow: "hidden",
                textOverflow: "unset",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {event?.eventName || "World Finals"}{" "}
              {/* Cập nhật fallback để khớp với hình ảnh */}
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <EventIcon
              style={{
                color: "rgba(244, 148, 52, 0.89)",
                fontWeight: "bolder",
              }}
            />
            <Typography variant="h6" sx={{ marginLeft: "10px" }}>
              {event?.startDate
                ? dayjs(event.startDate).format("MMMM D, YYYY")
                : "March 25, 2025"}{" "}
              {/* Cập nhật fallback để khớp với hình ảnh */}
            </Typography>
          </Grid>
        </Grid>

        {/* Hiển thị danh sách agenda hoặc nút Add nếu rỗng */}
        {agenda.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button variant="outlined" color="primary" onClick={handleAddEvent}>
              Add Time Slot
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveAll}
            >
              Save All
            </Button>
          </Box>
        ) : (
          <>
            {agenda.map((item, index) => (
              <Grid
                container
                spacing={3}
                key={index}
                sx={{ marginTop: "5px", alignItems: "center" }}
              >
                <Grid item xs={3}>
                  <TimeField
                    label="Start Time *"
                    value={item.startTime || null} // Đảm bảo giá trị là null nếu undefined
                    onChange={(newValue) =>
                      handleChange(index, "startTime", newValue)
                    }
                    format="hh:mm A" // Định dạng hiển thị 12h (AM/PM)
                  />
                </Grid>

                <Grid item xs={3}>
                  <TimeField
                    label="End Time *"
                    value={item.endTime || null} // Đảm bảo giá trị là null nếu undefined
                    onChange={(newValue) =>
                      handleChange(index, "endTime", newValue)
                    }
                    format="hh:mm A" // Định dạng hiển thị 12h (AM/PM)
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label="Description"
                    value={item.description || ""} // Đảm bảo giá trị là chuỗi rỗng nếu undefined
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => handleDeleteEvent(index)}
                    color="error"
                    sx={{
                      color: "#ff0000", // Màu đỏ cho thùng rác, giống hình
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)", // Hiệu ứng hover nhẹ
                        fontSize: "1.5 rem !important",
                        fontWeight: "bolder",
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddEvent}
              >
                Add Time Slot
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveAll}
              >
                Save All
              </Button>
            </Box>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default Agenda;
