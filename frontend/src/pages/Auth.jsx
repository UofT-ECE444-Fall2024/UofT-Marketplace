import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Alert } from '@mui/material';

const STYTCH_PUBLIC_TOKEN = "public-token-test-8d42d0cf-4108-47e6-ba12-8f83e93c6737";
const REDIRECT_URL = encodeURIComponent("http://localhost:5001/authenticate");
const STYTCH_BASE_URL = "https://test.stytch.com/v1/public";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear loading state when component mounts or URL changes
    setIsLoading(false);
    
    // Debug: Log the current URL and search params
    console.log('Current location:', location);
    console.log('Search params:', location.search);
    
    // Check for error or success messages in URL parameters
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const message = params.get('message');
    const userData = params.get('userData');
    
    console.log('Status:', status);
    console.log('Message:', message);
    console.log('User data:', userData);
    
    if (status === 'error') {
      setError(decodeURIComponent(message));
    } else if (status === 'success') {
      setSuccess(decodeURIComponent(message));
      if (userData) {
        try {
          // Parse the userData more reliably
          const decodedString = decodeURIComponent(userData);
          console.log('Decoded user data string:', decodedString);
          
          const pairs = decodedString.split('&');
          const userObject = {};
          
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            userObject[key] = decodeURIComponent(value);
          });
          
          console.log('Parsed user object:', userObject);
          
          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(userObject));
          console.log('Data stored in localStorage');
          
          // Navigate after a short delay to show the success message
          setTimeout(() => {
            console.log('Navigating to /home');
            navigate('/home');
          }, 1500);
        } catch (error) {
          console.error('Error processing user data:', error);
          setError('Error processing login data');
        }
      } else {
        console.warn('No user data received with success status');
      }
    }
  }, [location, navigate]);

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setError(''); // Clear any existing errors
    const microsoftOAuthURL = `${STYTCH_BASE_URL}/oauth/microsoft/start?public_token=${STYTCH_PUBLIC_TOKEN}&login_redirect_url=${REDIRECT_URL}&signup_redirect_url=${REDIRECT_URL}`;
    window.location.href = microsoftOAuthURL;
  };

  // Debug: Add a function to check localStorage
  const checkLocalStorage = () => {
    const userData = localStorage.getItem('user');
    console.log('Current localStorage user data:', userData);
  };

  useEffect(() => {
    // Check localStorage when component mounts
    checkLocalStorage();
  }, []);

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