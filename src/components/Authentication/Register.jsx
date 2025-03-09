import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../Service/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/148640546/original/907b3e144d371e4a3084dbf43a7348daa3966734/create-a-cool-modern-poster-for-your-event.jpg',
    'https://www.creative-flyers.com/wp-content/uploads/2019/05/Music-Festival-Poster-04_0063201905.jpg',
    'https://s3.amazonaws.com/thumbnails.venngage.com/template/5694c301-5ce8-4293-818b-f81f794c22f9.png',
    ''
  ];

  // Tự động chuyển ảnh sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(email, password, confirmPassword);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ff9800 0%, #f4511e 100%)",
        p: 0,
        overflow: "hidden",
      }}
    >
      {/* Form Register bên trái */}
      <Box
        sx={{
          flex: "1 1 50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            p: 4,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#f4511e",
              fontWeight: "bold",
              mb: 3,
              letterSpacing: "1px",
            }}
          >
            Event Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff9800" },
                "&:hover fieldset": { borderColor: "#f4511e" },
                "&.Mui-focused fieldset": { borderColor: "#f4511e" },
              },
              "& .MuiInputLabel-root": { color: "#ff9800" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#f4511e" },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff9800" },
                "&:hover fieldset": { borderColor: "#f4511e" },
                "&.Mui-focused fieldset": { borderColor: "#f4511e" },
              },
              "& .MuiInputLabel-root": { color: "#ff9800" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#f4511e" },
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff9800" },
                "&:hover fieldset": { borderColor: "#f4511e" },
                "&.Mui-focused fieldset": { borderColor: "#f4511e" },
              },
              "& .MuiInputLabel-root": { color: "#ff9800" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#f4511e" },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: "#ff9800",
              "&:hover": { backgroundColor: "#f4511e" },
              borderRadius: "8px",
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(244, 81, 30, 0.3)",
            }}
          >
            Register
          </Button>
          <Typography
            mt={3}
            sx={{
              color: "#666",
              fontSize: "0.9rem",
            }}
          >
            <span>
              Already have an account?{" "}
              <span
                style={{
                  color: "#ff9800",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Poster bên phải với carousel */}
      <Box
        sx={{
          flex: "1 1 50%",
          backgroundImage: `url("${images[currentImageIndex]}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: { xs: "none", md: "block" }, // Ẩn trên màn hình nhỏ
          transition: "background-image 0.5s ease-in-out", // Hiệu ứng chuyển ảnh
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(244, 81, 30, 0.3)", // Lớp phủ cam nhẹ
          },
        }}
      >
      </Box>
    </Container>
  );
};

export default Register;