import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Alert, 
  Container, 
  Typography, 
  Paper,
  Box,
  Tab,
  Tabs
} from '@mui/material';

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: ''
  });
  const [status, setStatus] = useState({ error: '', success: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setStatus({ error: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLogin = activeTab === 0;
    const endpoint = isLogin ? 'login' : 'register';

    // Only send relevant fields for login
    const submitData = isLogin 
      ? { username: formData.username, password: formData.password }
      : formData;

    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setStatus({ error: '', success: data.message });
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setStatus({ error: data.message || `${isLogin ? 'Login' : 'Registration'} failed`, success: '' });
      }
    } catch {
      setStatus({ error: 'Connection error. Please try again.', success: '' });
    }
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">Name of App</Typography>
          
          <Tabs value={activeTab} onChange={handleTabChange} className="w-full">
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {status.success && <Alert severity="success" className="w-full">{status.success}</Alert>}
          {status.error && <Alert severity="error" className="w-full">{status.error}</Alert>}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
            />
            
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />

            {activeTab === 1 && (
              <>
                <TextField
                  name="full_name"
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
                
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              className="mt-4"
            >
              {activeTab === 0 ? 'Login' : 'Create Account'}
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
