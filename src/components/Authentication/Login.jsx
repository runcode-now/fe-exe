import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../Service/authService";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  const images = [
    'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/148640546/original/907b3e144d371e4a3084dbf43a7348daa3966734/create-a-cool-modern-poster-for-your-event.jpg',
    'https://i.pinimg.com/736x/0a/6d/95/0a6d95b2fd58623e878b10a656424079.jpg',
    'https://img.freepik.com/free-vector/abstract-party-poster-with-geometric-style_23-2147829365.jpg',
  ];

  // Tự động chuyển ảnh sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

  const handleLogin = async () => {
    setError(null);

    try {
      const data = await loginService(email, password);
      console.log("Login response:", data);

      if (data?.token) {
        await login(data.token); // Cập nhật trạng thái đăng nhập
        navigate("/"); // Điều hướng về trang chủ
      } else {
        setError("Login failed: Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
      {/* Poster bên trái với carousel */}
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

      {/* Form Login bên phải */}
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
            Event Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
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
            Login
          </Button>
          <Typography
            mt={3}
            sx={{
              color: "#666",
              fontSize: "0.9rem",
            }}
          >
            <span>
              Don't have an account?{" "}
              <span
                style={{
                  color: "#ff9800",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </span>
            <br />
            <span>
              Forgot password?{" "}
              <span
                style={{
                  color: "#ff9800",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Reset Password
              </span>
            </span>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;