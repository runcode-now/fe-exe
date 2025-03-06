import React, { useState } from 'react';
import { forgotPassword } from "../../Service/authService"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.Message || 'If the email exists, a password reset link has been sent.');
    } catch (error) {
      setMessage(error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;