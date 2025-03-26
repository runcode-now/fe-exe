import React, { useState, useEffect } from "react";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Authentication/AuthContext";

const GenEventForm = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventName: "",
    startDate: null,
    endDate: null,
    dressCode: "",
    concept: "",
    location: "",
    participants: "",
    categoryId: "",
    description: "", // Thêm trường description
  });

  const [errors, setErrors] = useState({
    eventName: "",
    startDate: "",
    categoryId: "",
    description: "",
  });
  const { user } = useAuth(); // Lấy user từ AuthContext
  // const [userLocation, setUserLocation] = useState(null);
  // const [mapCenter, setMapCenter] = useState({ lat: 21.0278, lng: 105.8342 });
  // const [loadingMap, setLoadingMap] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://103.179.185.149:8435/GetEventCagetory"
        );
        setCategories(response.data.data); // Giả sử API trả về { message: "...", data: [...] }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const isFormValid = () => {
    const start = eventData.startDate;
    const end = eventData.endDate;
    return (
      eventData.eventName &&
      eventData.startDate &&
      eventData.categoryId &&
      eventData.description &&
      (!end || !start || !end.isBefore(start))
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("eventData:", eventData);
    // Check for any errors before submitting
    if (!isFormValid()) {
      setErrors({
        eventName: !eventData.eventName ? "Event name is required" : "",
        startDate: !eventData.startDate ? "Start date is required" : "",
        categoryId: !eventData.categoryId ? "Category are required" : "",
        description: !eventData.description ? "Description is required" : "",
      });
      return; // Prevent form submission
    }

    const eventPayload = {
      EventName: eventData.eventName, // Bắt buộc, không cần kiểm tra
      StartDate: eventData.startDate.toISOString(),
      EndDate: eventData.endDate ? eventData.endDate.toISOString() : undefined, // Nếu có, chuyển đổi thành ISO string
      DressCode: eventData.dressCode || undefined, // Nếu null hoặc empty, không gửi
      Concept: eventData.concept || undefined, // Nếu null hoặc empty, không gửi
      Location: eventData.location || undefined, // Nếu null hoặc empty, không gửi
      ParticipantCount: eventData.participants || undefined, // Nếu null hoặc empty, không gửi
      CategoryId: eventData.categoryId, // Bắt buộc, không cần kiểm tra
      OrganizerId: user.id,
      Description: eventData.description || undefined,
    };
    console.log("EventPayload", eventPayload);

    try {
      await createEvent(eventPayload);
      navigate("/", {
        state: { successMessage: "Event created successfully!" },
      });

      // navigate("/dashboard"); // Redirect to dashboard on success
    } catch (error) {
      toast.error("Failed to create event. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await axios.post(
        "http://103.179.185.149:8435/api/Event/create",
        eventData
      );
      console.log("Event created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const handleChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev, [field]: "" }; // Reset lỗi của field hiện tại

      if (field === "endDate" || field === "startDate") {
        const start = eventData.startDate;
        const end = field === "endDate" ? value : eventData.endDate;

        if (start && end && end.isBefore(start)) {
          newErrors.endDate = "End Date must be greater than Start Date";
        }
      }

      return newErrors;
    });
  };
  // Handle when user blur an input field
  const handleBlur = (field) => {
    if (!eventData[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "This field is required",
      }));
    }
  };
  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  // maps

  // useEffect(() => {
  //   setLoadingMap(false);
  //   if (navigator.geolocation) {
  //     navigator.geolocation.watchPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //       setUserLocation({ lat: latitude, lng: longitude });
  //       setMapCenter({ lat: latitude, lng: longitude }); // Di chuyển bản đồ đến vị trí người dùng
  //     });
  //   }
  // }, []);

  // Hàm để toggle mở/đóng sidebar

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
          padding: "10px",
          maxWidth: "100%",
          margin: "0 auto",
          marginY: "10px",
          marginLeft: "20px",
          backgroundColor: "#F5F5F7",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              padding: "20px",
              maxWidth: "90%",
              margin: "0 auto",
              marginY: "50px",
            }}
          >
            {/* Progress Indicator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                marginBottom: "20px",
              }}
            >
              <Box sx={styles.stepContainer}>
                <CheckCircleIcon sx={{ color: "#FF5722", fontSize: 24 }} />
                <Box sx={styles.stepText}>
                  <Typography sx={styles.stepTitle(step >= 1)}>
                    General Information
                  </Typography>
                  <Typography sx={styles.stepDescription}>
                    Info of your event
                  </Typography>
                </Box>
              </Box>

              <Box sx={styles.progressLine(step >= 2)} />

              <Box sx={styles.stepContainer}>
                {step >= 2 ? (
                  <CheckCircleIcon sx={{ color: "#FF5722", fontSize: 24 }} />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#FF5722", fontSize: 24 }}
                  />
                )}
                <Box sx={styles.stepText}>
                  <Typography sx={styles.stepTitle(step >= 2)}>
                    Location Information
                  </Typography>
                  <Typography sx={styles.stepDescription}>
                    Location details, service offers, etc.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Step 1: General Information */}
            {step === 1 && (
              <Box sx={styles.generalContainer}>
                <Box sx={styles.generalHeader}>
                  <Typography variant="h6">General</Typography>
                </Box>

                <Box sx={{ padding: "20px" }}>
                  <TextField
                    label={
                      <>
                        Event Name{" "}
                        <Typography component="span" color="red">
                          *
                        </Typography>
                      </>
                    }
                    fullWidth
                    value={eventData.eventName}
                    onChange={(e) => handleChange("eventName", e.target.value)}
                    onBlur={() => handleBlur("eventName")}
                    error={!!errors.eventName}
                    helperText={errors.eventName}
                  />

                  {/* Start Date - End Date */}
                  <Grid container spacing={2} sx={{ marginTop: "5px" }}>
                    <Grid item xs={6}>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label={
                          <>
                            Start Date{" "}
                            <Typography component="span" color="red">
                              *
                            </Typography>
                          </>
                        }
                        value={eventData.startDate}
                        onChange={(newValue) =>
                          handleChange("startDate", newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            onBlur: () => handleBlur("startDate"),
                            error: !!errors.startDate,
                            helperText: errors.startDate,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="End Date"
                        value={eventData.endDate}
                        onChange={(newValue) =>
                          handleChange("endDate", newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Dress Code - Concept */}
                  <Grid container spacing={2} sx={{ marginTop: "5px" }}>
                    <Grid item xs={6}>
                      <TextField
                        label="Dress Code"
                        fullWidth
                        value={eventData.dressCode}
                        onChange={(e) =>
                          handleChange("dressCode", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Concept"
                        fullWidth
                        value={eventData.concept}
                        onChange={(e) =>
                          handleChange("concept", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ marginTop: "5px" }}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          Category{" "}
                          <Typography component="span" color="red">
                            *
                          </Typography>
                        </InputLabel>
                        <Select
                          label="Category *"
                          value={eventData.categoryId}
                          onChange={(e) =>
                            handleChange("categoryId", e.target.value)
                          }
                          onBlur={() => handleBlur("categoryId")}
                          error={!!errors.categoryId}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                            },
                          }}
                          sx={{
                            "& .MuiMenuItem-root": {
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                            },
                          }}
                        >
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <MenuItem
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.categoryName}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>Loading categories...</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      {errors.categoryId && (
                        <Typography color="error" variant="body2">
                          {errors.categoryId}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="No. of Participants"
                        fullWidth
                        type="number" // Giới hạn chỉ nhập số
                        value={eventData.participants}
                        onChange={(e) =>
                          handleChange("participants", e.target.value)
                        }
                        inputProps={{
                          min: 0, // Không cho phép số âm
                          step: 1, // Chỉ cho phép số nguyên (không cho số thập phân)
                        }}
                        InputProps={{
                          inputProps: {
                            pattern: "[0-9]*", // Chỉ cho phép các ký tự số
                          },
                        }}
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                            {
                              display: "none", // Ẩn các nút tăng/giảm (spin buttons) trên Chrome
                            },
                          "& input[type=number]": {
                            MozAppearance: "textfield", // Ẩn spin buttons trên Firefox
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Next Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Step 2: Location Information */}
            {step === 2 && (
              <Box sx={styles.generalContainer}>
                <Box sx={styles.generalHeader}>
                  <Typography variant="h6">Location Information</Typography>
                </Box>

                <Box sx={{ padding: "20px" }}>
                  {/* Google Map Component */}

                  <TextField
                    label="Location"
                    value={eventData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    fullWidth
                    sx={{ marginBottom: "20px" }}
                  />

                  <TextField
                    label={
                      <>
                        Description{" "}
                        <Typography component="span" color="red">
                          *
                        </Typography>
                      </>
                    }
                    onBlur={() => handleBlur("description")}
                    error={!!errors.description}
                    helperText={errors.description} // Thêm helperText để hiển thị thông báo lỗi
                    value={eventData.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    fullWidth
                    multiline
                    rows={6}
                    sx={{ marginBottom: "20px" }}
                  />

                  <Typography sx={{ textAlign: "center" }}>
                    Loading map...
                  </Typography>

                  {/* Back & Submit Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FF5722",
                        color: "#FFF",
                      }}
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                    >
                      Save and Create
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  );
};

// **Styles**
const styles = {
  generalContainer: {
    backgroundColor: "white",
    boxShadow: 3,
    borderRadius: "8px",
    overflow: "hidden",
  },
  stepContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  generalHeader: {
    backgroundColor: "#FF5722",
    color: "white",
    padding: "20px",
    fontWeight: "bold",
  },
  stepNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#BDBDBD",
  },
  stepText: {
    display: "flex",
    flexDirection: "column",
  },
  stepTitle: (isActive) => ({
    fontWeight: "bold",
    color: isActive ? "#FF////5722" : "#BDBDBD",
  }),
  stepDescription: {
    fontSize: "12px",
    color: "#BDBDBD",
  },
  progressLine: (isActive) => ({
    height: "4px",
    width: "200px",
    backgroundColor: isActive ? "#FF5722" : "#BDBDBD",
    marginX: "30px",
    borderRadius: "999px",
  }),
};

export default GenEventForm;
