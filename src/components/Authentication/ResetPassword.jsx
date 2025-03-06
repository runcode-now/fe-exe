import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from "../../Service/authService"; 

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!userId || !token) {
      setMessage('Invalid reset link.');
    }
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await resetPassword(userId, token, newPassword);
      setMessage(response.Message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error || 'Failed to reset password.');
    }
  };

  if (!userId || !token) {
    return <div>{message}</div>;
  }

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Reset Password
        </button>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;