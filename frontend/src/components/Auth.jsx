import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Alert, 
  Container, 
  Typography, 
  Paper,
  Box 
} from '@mui/material';

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setFlashMessage('Successfully logged in!');
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">
            Name of App
          </Typography>

          {flashMessage && (
            <Alert severity="success" className="w-full">
              {flashMessage}
            </Alert>
          )}

          <Typography variant="h5">
            Login
          </Typography>

          {error && (
            <Alert severity="error" className="w-full">
              {error}
            </Alert>
          )}

        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;