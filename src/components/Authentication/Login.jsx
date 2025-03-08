import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../Service/authService";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);

    try {
      const data = await loginService(email, password);
      console.log("Login response:", data);

      if (data?.token) {
        // Gọi hàm login từ AuthContext để cập nhật trạng thái
        await login(data.token);
        navigate("/");
      } else {
        setError("Login failed: Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h5">Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography mt={2}>
          <span>
            Don't have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
          </span>
          <br />
          <span>
            Forgot password? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/forgot')}>Reset Password</span>
          </span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;