import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../Service/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
    <Container maxWidth="xs">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h5">Register</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
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
        <TextField 
          label="Confirm Password" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleRegister}
        >
          Register
        </Button>
        <Typography mt={2}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;