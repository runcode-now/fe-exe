import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { forgotPassword } from "../../Service/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await forgotPassword(email);
      setMessage(
        response.Message || "If the email exists, a password reset link has been sent."
      );
    } catch (error) {
      setMessage(error || "Failed to send reset link.");
    } finally {
      setLoading(false);
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
      {/* Poster cố định bên trái */}
      <Box
        sx={{
          flex: "1 1 25%", // Chiếm 25% chiều rộng
          backgroundImage: `url("https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/148640546/original/907b3e144d371e4a3084dbf43a7348daa3966734/create-a-cool-modern-poster-for-your-event.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: { xs: "none", md: "block" }, // Ẩn trên màn hình nhỏ
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
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Event Highlights
        </Typography>
      </Box>

      {/* Form Forgot Password ở giữa */}
      <Box
        sx={{
          flex: "1 1 50%", // Chiếm 50% chiều rộng
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
            Forgot Password
          </Typography>
          {message && (
            <Alert
              severity={message.includes("sent") ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Box>
      </Box>

      {/* Poster cố định bên phải */}
      <Box
        sx={{
          flex: "1 1 25%", // Chiếm 25% chiều rộng
          backgroundImage: `url("https://i.pinimg.com/736x/96/36/b9/9636b9728ce72fe1079e3c5acefc91b2.jpg")`, // Ảnh khác với bên trái
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: { xs: "none", md: "block" }, // Ẩn trên màn hình nhỏ
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
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Stay Connected
        </Typography>
      </Box>
    </Container>
  );
};

export default ForgotPassword;