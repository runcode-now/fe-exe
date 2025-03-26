import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextureIcon from "@mui/icons-material/Texture";
import EventIcon from "@mui/icons-material/Event";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini API với API_KEY
const genAI = new GoogleGenerativeAI("AIzaSyDFWLgnBucSvGbu4MKJV0rlZUDD1FQhDpM"); // Thay YOUR_GEMINI_API_KEY bằng API key của bạn
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Agenda = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [categoryName, setCategoryName] = useState(null); // Thêm state để lưu categoryName
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  // Lấy thông tin sự kiện, danh sách agenda và categoryName
  useEffect(() => {
    const fetchEventAndAgendas = async () => {
      try {
        const eventResponse = await axios.get(
          `http://103.179.185.149:8435/api/Event/getByEventId/${eventId}`
        );
        setEvent(eventResponse.data.data);

        const agendaResponse = await axios.get(
          `http://103.179.185.149:8435/api/Agenda/getByEvent/${eventId}`
        );

        const categoryResponse = await axios.get(
          `http://103.179.185.149:8435/GetCagetoryById/${eventResponse.data.data.categoryId}`
        );
        setCategoryName(categoryResponse.data.categoryName); // Lấy categoryName từ response

        const parsedAgendas = Array.isArray(agendaResponse.data.data)
          ? agendaResponse.data.data.map((item) => ({
              agendaId: item.agendaId || null,
              startTime: item.timeStart
                ? parseTimeSpanToDayjs(item.timeStart)
                : null,
              endTime: item.timeEnd ? parseTimeSpanToDayjs(item.timeEnd) : null,
              description: item.description || "",
              eventId: item.eventId,
            }))
          : [];
        setAgenda(parsedAgendas);
      } catch (error) {
        console.error("Error fetching event or agendas:", error);
        setEvent(null);
        setAgenda([]);
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

  // Hàm parse TimeSpan từ C# thành dayjs object
  const parseTimeSpanToDayjs = (timeSpan) => {
    if (!timeSpan || timeSpan.trim() === "") return null;
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
    if (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59 &&
      seconds >= 0 &&
      seconds <= 59
    ) {
      return dayjs("1970-01-01")
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds)
        .set("millisecond", 0);
    }
    return null;
  };

  // Hàm chuyển đổi dayjs object thành TimeSpan cho C#
  const formatDayjsToTimeSpan = (dayjsTime) => {
    if (!dayjsTime) return null;
    const hours = dayjsTime.hour();
    const minutes = dayjsTime.minute();
    const seconds = dayjsTime.second();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Hàm làm sạch chuỗi Markdown để chỉ giữ lại JSON
  const cleanMarkdown = (text) => {
    // Loại bỏ ```json và ``` ở đầu và cuối chuỗi
    return text
      .replace(/```json\n/, '') // Loại bỏ ```json và dòng mới
      .replace(/```\n/, '')     // Loại bỏ ``` và dòng mới
      .replace(/```/, '')       // Loại bỏ ``` (trong trường hợp không có dòng mới)
      .trim();                  // Loại bỏ khoảng trắng thừa
  }

  // Hàm gọi Gemini API để tạo agenda dựa trên categoryName
  const generateAgendasWithGemini = async () => {
    if (!categoryName) {
      toast.error("Category name not found. Cannot generate agendas.");
      return;
    }
  
    try {
      const prompt = `
        You are an event planner. Based on the event category "${categoryName}", generate a list of agendas for a one-day event. Each agenda item should include:
        - Start time (in 24-hour format, e.g., "09:00")
        - End time (in 24-hour format, e.g., "10:00")
        - Description of the activity (a short sentence, e.g., "Welcome speech and introduction")
        Provide the output in JSON format with at least 3 agenda items. Example:
        [
          { "startTime": "09:00", "endTime": "09:30", "description": "Welcome speech and introduction" },
          { "startTime": "09:30", "endTime": "10:30", "description": "Keynote presentation" },
          { "startTime": "10:30", "endTime": "11:00", "description": "Coffee break" }
        ]
      `;
  
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
  
      // Làm sạch chuỗi Markdown trước khi parse
      responseText = cleanMarkdown(responseText);
  
      // Parse JSON từ chuỗi đã làm sạch
      const generatedAgendas = JSON.parse(responseText);
  
      // Chuyển đổi dữ liệu từ Gemini thành định dạng phù hợp với state agenda
      const newAgendas = generatedAgendas.map((item) => {
        const startTimeParts = item.startTime.split(":");
        const endTimeParts = item.endTime.split(":");
        return {
          agendaId: null,
          startTime: dayjs("1970-01-01")
            .set("hour", parseInt(startTimeParts[0]))
            .set("minute", parseInt(startTimeParts[1]))
            .set("second", 0),
          endTime: dayjs("1970-01-01")
            .set("hour", parseInt(endTimeParts[0]))
            .set("minute", parseInt(endTimeParts[1]))
            .set("second", 0),
          description: item.description,
          eventId: eventId,
        };
      });
  
      // Cập nhật state agenda với danh sách mới
      setAgenda(newAgendas);
      toast.success("Agendas generated successfully!");
    } catch (error) {
      console.error("Error generating agendas with Gemini:", error);
      toast.error("Failed to generate agendas. Please try again.");
    }
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
    updatedAgenda[index][field] = value;
    setAgenda(updatedAgenda);
  };

  // Xóa một sự kiện khỏi danh sách
  const handleDeleteEvent = (index) => {
    const updatedAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(updatedAgenda);
  };

  // Lưu toàn bộ danh sách agenda lên API
  const handleSaveAll = async () => {
    try {
      if (!agenda || agenda.length === 0) {
        toast.error("No agendas to save. Please add at least one time slot.");
        return;
      }

      const invalidAgenda = agenda.some(
        (item) => !item.startTime || !item.endTime || !item.description.trim()
      );

      if (invalidAgenda) {
        toast.error("Please fill in all required fields before saving.");
        return;
      }

      const payload = agenda.map((item) => ({
        AgendaId: item.agendaId || null,
        TimeStart: item.startTime ? formatDayjsToTimeSpan(item.startTime) : null,
        TimeEnd: item.endTime ? formatDayjsToTimeSpan(item.endTime) : null,
        Description: item.description || null,
        EventId: eventId,
      }));

      const response = await axios.post(
        `http://103.179.185.149:8435/api/Agenda/saveAll/${eventId}`,
        payload
      );
      setRefreshKey((prevKey) => prevKey + 1);
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
              {event?.eventName || "World Finals"}
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
                : "March 25, 2025"}
            </Typography>
          </Grid>
        </Grid>

        {/* Thêm nút để gọi Gemini API và tạo agenda */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateAgendasWithGemini}
          >
            Generate Agendas with AI
          </Button>
        </Box>

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
                    value={item.startTime || null}
                    onChange={(newValue) =>
                      handleChange(index, "startTime", newValue)
                    }
                    format="hh:mm A"
                  />
                </Grid>

                <Grid item xs={3}>
                  <TimeField
                    label="End Time *"
                    value={item.endTime || null}
                    onChange={(newValue) =>
                      handleChange(index, "endTime", newValue)
                    }
                    format="hh:mm A"
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    label="Description"
                    value={item.description || ""}
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
                      color: "#ff0000",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
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
