import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper,
  Box,
  Button
} from '@mui/material';
import { Alert } from '@mui/material';

// Constants for Stytch configuration
const STYTCH_PUBLIC_TOKEN = "public-token-test-8d42d0cf-4108-47e6-ba12-8f83e93c6737";
const REDIRECT_URL = encodeURIComponent("http://localhost:5001/authenticate");
const STYTCH_BASE_URL = "https://test.stytch.com/v1/public";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState({ error: '', success: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Handle the OAuth callback
  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      handleAuthentication(token);
    }
  }, [location]);

  const handleAuthentication = async (token) => {
    setIsLoading(true);
    try {
      // Call your backend authentication endpoint
      const response = await fetch(`http://localhost:5001/authenticate?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        setStatus({ 
          error: '', 
          success: data.message || 'Login successful!' 
        });
        
        // Redirect after a short delay
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setStatus({ 
          error: data.message || 'Authentication failed', 
          success: '' 
        });
      }
    } catch (error) {
      setStatus({ 
        error: 'Connection error. Please try again.', 
        success: '' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    const microsoftOAuthURL = `${STYTCH_BASE_URL}/oauth/microsoft/start?public_token=${STYTCH_PUBLIC_TOKEN}&login_redirect_url=${REDIRECT_URL}&signup_redirect_url=${REDIRECT_URL}`;
    window.location.href = microsoftOAuthURL;
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">Name of App</Typography>
          
          {status.success && <Alert severity="success" className="w-full">{status.success}</Alert>}
          {status.error && <Alert severity="error" className="w-full">{status.error}</Alert>}

          <Button 
            onClick={handleMicrosoftLogin}
            variant="contained" 
            size="large"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign in with Microsoft'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;