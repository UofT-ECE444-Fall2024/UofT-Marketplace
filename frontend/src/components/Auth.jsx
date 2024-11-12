import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, Container, Typography, Paper, Box } from '@mui/material';

const Auth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ error: '', success: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setStatus({ error: '', success: 'Successfully logged in!' });
      } else {
        setStatus({ error: data.message || 'Login failed', success: '' });
      }
    } catch(error) {
      console.error('Connection error:', error);
      setStatus({ error: 'Connection error. Please try again.', success: '' });
    }
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">Bobaplace</Typography>
          {status.success && <Alert severity="success" className="w-full">{status.success}</Alert>}
          <Typography variant="h5">Login</Typography>
          {status.error && <Alert severity="error" className="w-full">{status.error}</Alert>}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {['username', 'password'].map((field) => (
              <TextField
                key={field}
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'password' ? 'password' : 'text'}
                variant="outlined"
                fullWidth
                value={formData[field]}
                onChange={handleChange}
              />
            ))}
            <Button type="submit" variant="contained" size="large" className="mt-4">
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;