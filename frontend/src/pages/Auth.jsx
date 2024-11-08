import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Alert } from '@mui/material';

const STYTCH_PUBLIC_TOKEN = "public-token-test-8d42d0cf-4108-47e6-ba12-8f83e93c6737";
const REDIRECT_URL = encodeURIComponent("http://localhost:5001/authenticate");
const STYTCH_BASE_URL = "https://test.stytch.com/v1/public";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseUserData = (encodedData) => {
    const decodedString = decodeURIComponent(encodedData);
    const pairs = decodedString.split('&');
    const userObject = {};
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      userObject[key] = decodeURIComponent(value);
    });
    
    return userObject;
  };

  useEffect(() => {
    setIsLoading(false);
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const message = params.get('message');
    const userData = params.get('userData');
    const clearOauth = params.get('clear_oauth');
    
    // Clear URL parameters to prevent state persistence
    if (location.search) {
      navigate('/', { replace: true });
    }

    if (status === 'error') {
      setError(decodeURIComponent(message));
      // Reset Stytch OAuth state if needed
      if (clearOauth === 'true') {
        localStorage.removeItem('stytch_oauth_state');
      }
    } else if (status === 'success' && userData) {
      setSuccess(decodeURIComponent(message));
      try {
        const userObject = parseUserData(userData);
        localStorage.setItem('user', JSON.stringify(userObject));
        setTimeout(() => navigate('/home'), 1500);
      } catch (error) {
        setError('Error processing login data');
      }
    }
  }, [location, navigate]);

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setError('');
    localStorage.removeItem('stytch_oauth_state'); // Clear any existing OAuth state
    const microsoftOAuthURL = `${STYTCH_BASE_URL}/oauth/microsoft/start?public_token=${STYTCH_PUBLIC_TOKEN}&login_redirect_url=${REDIRECT_URL}&signup_redirect_url=${REDIRECT_URL}`;
    window.location.href = microsoftOAuthURL;
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">
            Name of App
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              className="w-full"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              className="w-full"
              onClose={() => setSuccess('')}
            >
              {success}
            </Alert>
          )}

          <Typography className="text-center text-gray-600">
            Please sign in with your UToronto email address (@utoronto.ca)
          </Typography>

          <Button 
            onClick={handleMicrosoftLogin}
            variant="contained" 
            size="large"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting to Microsoft...' : 'Sign in with Microsoft'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;