import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDFWLgnBucSvGbu4MKJV0rlZUDD1FQhDpM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Plan = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [detailedAgendas, setDetailedAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách TaskJob từ DB
  const fetchTaskJobs = async () => {
    try {
      const response = await axios.get(
        `http://103.179.185.149:8435/api/TaskJob/getByEventId/${eventId}`
      );
      const taskJobs = response.data.data;
      setDetailedAgendas(taskJobs);
    } catch (error) {
      console.error("Error fetching task jobs:", error);
      toast.error("Failed to load task jobs. Please try again.");
    }
  };

  // Lấy thông tin sự kiện, categoryName và danh sách TaskJob
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(
          `http://103.179.185.149:8435/api/Event/getByEventId/${eventId}`
        );
        setEvent(eventResponse.data.data);

        const categoryResponse = await axios.get(
          `http://103.179.185.149:8435/GetCategoryById/${eventResponse.data.data.categoryId}`
        );
        setCategoryName(categoryResponse.data.categoryName);

        // Gọi API để lấy danh sách TaskJob
        await fetchTaskJobs();
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    } else {
      setError("No event ID provided.");
      setLoading(false);
    }
  }, [eventId]);

  // Hàm làm sạch chuỗi Markdown
  const cleanMarkdown = (text) => {
    return text
      .replace(/```json\n/, "")
      .replace(/```\n/, "")
      .replace(/```/, "")
      .trim();
  };

  // Hàm gọi Gemini API để generate agenda chi tiết
  const generateDetailedAgendas = async () => {
    if (!event || !categoryName) {
      toast.error("Event or category not found. Cannot generate agendas.");
      return;
    }

    try {
      const prompt = `
        You are an event planner. Based on the following event details, generate a detailed agenda for a one-day event:
        - Event Name: "${event.eventName}"
        - Category: "${categoryName}"
        - Description: "${event.description || "A professional seminar"}"
        - Number of Attendees: ${event.numberOfAttendees || 50}

        For each agenda item, include the following details:
        - Task (e.g., "Welcome Speech")
        - Assignee (assign a suitable person or team based on the task, e.g., "Event Host" for "Welcome Speech", "Catering Team" for "Coffee Break", "Guest Speaker" for "Keynote Presentation", "Tech Support" for "Setup Projector", etc.)
        - Priority (e.g., "High", "Medium", "Low")
        - Description (e.g., "Opening remarks and introduction")
        - Related Documents (e.g., "Speech script, Event agenda PDF")
        - Notes (e.g., "Ensure microphone is working")

        Provide the output in JSON format with at least 3 agenda items. Do not include any Markdown formatting. Example:
        [
          {
            "task": "Welcome Speech",
            "assignee": "Event Host",
            "priority": "High",
            "description": "Opening remarks and introduction",
            "relatedDocuments": "Speech script, Event agenda PDF",
            "notes": "Ensure microphone is working"
          },
          {
            "task": "Keynote Presentation",
            "assignee": "Guest Speaker",
            "priority": "High",
            "description": "Presentation on industry trends",
            "relatedDocuments": "Presentation slides",
            "notes": "Check projector setup"
          },
          {
            "task": "Coffee Break",
            "assignee": "Catering Team",
            "priority": "Medium",
            "description": "Serve coffee and snacks",
            "relatedDocuments": "Catering menu",
            "notes": "Ensure enough cups and napkins"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      responseText = cleanMarkdown(responseText);

      const generatedAgendas = JSON.parse(responseText);

      // Thêm dữ liệu mới vào danh sách hiện có thay vì ghi đè
      setDetailedAgendas((prevAgendas) => [
        ...prevAgendas,
        ...generatedAgendas.map((item) => ({
          ...item,
          eventId: eventId,
        })),
      ]);
      toast.success("Detailed agendas generated successfully!");
    } catch (error) {
      console.error("Error generating detailed agendas:", error);
      toast.error("Failed to generate detailed agendas. Please try again.");
    }
  };

  // Hàm kiểm tra xem một agenda có đầy đủ các trường bắt buộc hay không
  const validateAgenda = (agenda) => {
    return (
      agenda.task &&
      agenda.assignee &&
      agenda.priority &&
      agenda.description &&
      agenda.relatedDocuments &&
      agenda.notes
    );
  };

  // Hàm lưu tất cả agendas
  const saveAllAgendas = async () => {
    try {
      // Kiểm tra nếu danh sách rỗng
      if (detailedAgendas.length === 0) {
        toast.error("No tasks to save. Please add at least one task.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Validate trước khi gửi
      const isValid = detailedAgendas.every((agenda) => validateAgenda(agenda));

      if (!isValid) {
        toast.error(
          "Please fill in all required fields for all tasks before saving.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return;
      }

      // Gửi danh sách detailedAgendas về API
      const response = await axios.post(
        `http://103.179.185.149:8435/api/TaskJob/saveAll/${eventId}`,
        detailedAgendas
      );

      if (response.data.isSuccess) {
        toast.success(
          response.data.message || "All agendas saved successfully!",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Gọi lại API để lấy dữ liệu mới nhất từ DB
        await fetchTaskJobs();
      } else {
        throw new Error(response.data.message || "Failed to save agendas.");
      }
    } catch (error) {
      console.error("Error saving all agendas:", error);
      toast.error(
        error.message || "Failed to save agendas. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  // Hàm xóa agenda khỏi danh sách
  const handleDeleteAgenda = (index) => {
    const updatedAgendas = detailedAgendas.filter((_, i) => i !== index);
    setDetailedAgendas(updatedAgendas);
  };

  // Hàm cập nhật giá trị của agenda
  const handleChange = (index, field, value) => {
    const updatedAgendas = [...detailedAgendas];
    updatedAgendas[index][field] = value;
    setDetailedAgendas(updatedAgendas);
  };

  // Hàm thêm agenda mới
  const handleAddNewTask = () => {
    const newAgenda = {
      task: "",
      assignee: "Event Host", // Gán assignee mặc định là "Event Host"
      priority: "",
      description: "",
      relatedDocuments: "",
      notes: "",
      eventId: eventId,
    };
    setDetailedAgendas([...detailedAgendas, newAgenda]);
  };

  if (loading) {
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
        Loading...
      </Typography>
    );
  }

  if (error) {
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
  }

  return (
    <Box
      sx={{
        padding: "60px",
        maxWidth: "80%",
        margin: "auto",
        marginY: "20px",
        backgroundColor: "#f5f5f5",
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

      <Button
        variant="outlined"
        color="warning"
        sx={{ marginTop: "20px", marginLeft: "65px", borderRadius: "8px" }}
        onClick={() => navigate(`/displayEvent/${event.eventId}`)}
      >
        Back to display event
      </Button>

      <Typography
        variant="h4"
        color="secondary"
        textAlign="center"
        fontWeight="bold"
      >
        Make plan
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ color: "#4C4E64DE", fontWeight: "bolder", marginTop: "5px" }}
      >
        <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
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
            {event?.eventName || "Event Name"}
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
          <Typography variant="h6" sx={{ marginLeft: "10px" }}>
            {event?.startDate
              ? new Date(event.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "March 16, 2025"}
          </Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={generateDetailedAgendas}
        >
          Generate plan with AI
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddNewTask}
        >
          Add New Task
        </Button>
        <Button variant="contained" color="secondary" onClick={saveAllAgendas}>
          Save All
        </Button>
      </Box>

      {detailedAgendas.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            marginTop: "20px",
            color: "#797979",
          }}
        >
          Click "Generate Agendas with AI" or "Add New Task" to start.
        </Typography>
      ) : (
        <Box sx={{ marginTop: "30px" }}>
          {detailedAgendas.map((agenda, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: "30px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                padding: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#1976d2",
                    marginBottom: "20px",
                    width: "70%",
                  }}
                >
                  <TextField
                    value={agenda.task || ""}
                    onChange={(e) =>
                      handleChange(index, "task", e.target.value)
                    }
                    placeholder="Enter task name"
                    variant="standard"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#1976d2",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      },
                    }}
                  />
                </Typography>
                <IconButton
                  onClick={() => handleDeleteAgenda(index)}
                  color="error"
                  sx={{
                    color: "#ff0000",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>

              <Box sx={{ marginTop: "20px" }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      label="Assignee"
                      value={agenda.assignee || ""}
                      onChange={(e) =>
                        handleChange(index, "assignee", e.target.value)
                      }
                      placeholder="Enter assignee (e.g., Event Host)"
                      fullWidth
                      sx={{
                        marginBottom: "20px",
                        "& .MuiInputBase-input": {
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ marginBottom: "20px" }}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={agenda.priority || ""}
                        onChange={(e) =>
                          handleChange(index, "priority", e.target.value)
                        }
                        label="Priority"
                        sx={{
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        marginBottom: "8px",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Description
                    </Typography>
                    <Box sx={{ marginBottom: "20px" }}>
                      <textarea
                        value={agenda.description || ""}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                        placeholder="Enter description"
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          resize: "both",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          backgroundColor: "#f9f9f9",
                          padding: "10px",
                          fontSize: "1rem",
                          lineHeight: "1.5",
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        marginBottom: "8px",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Related Documents
                    </Typography>
                    <Box sx={{ marginBottom: "20px" }}>
                      <textarea
                        value={agenda.relatedDocuments || ""}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "relatedDocuments",
                            e.target.value
                          )
                        }
                        placeholder="Enter related documents"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          resize: "both",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          backgroundColor: "#f9f9f9",
                          padding: "10px",
                          fontSize: "1rem",
                          lineHeight: "1.5",
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#555",
                        marginBottom: "8px",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Notes
                    </Typography>
                    <Box sx={{ marginBottom: "20px" }}>
                      <textarea
                        value={agenda.notes || ""}
                        onChange={(e) =>
                          handleChange(index, "notes", e.target.value)
                        }
                        placeholder="Enter notes"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          resize: "both",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          backgroundColor: "#f9f9f9",
                          padding: "10px",
                          fontSize: "1rem",
                          lineHeight: "1.5",
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Plan;
