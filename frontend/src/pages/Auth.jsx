import React from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  Box,
  Button
} from '@mui/material';

// Constants for Stytch configuration
const STYTCH_PUBLIC_TOKEN = "public-token-test-8d42d0cf-4108-47e6-ba12-8f83e93c6737";
const REDIRECT_URL = encodeURIComponent("http://localhost:3000/home");
const STYTCH_BASE_URL = "https://test.stytch.com/v1/public";

const Auth = () => {
  const handleMicrosoftLogin = () => {
    const microsoftOAuthURL = `${STYTCH_BASE_URL}/oauth/microsoft/start?public_token=${STYTCH_PUBLIC_TOKEN}&login_redirect_url=${REDIRECT_URL}&signup_redirect_url=${REDIRECT_URL}`;
    window.location.href = microsoftOAuthURL;
  };

  return (
    <Container maxWidth="sm" className="mt-16">
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col items-center gap-6">
          <Typography variant="h3" className="font-bold">Name of App</Typography>
          
          <Button 
            onClick={handleMicrosoftLogin}
            variant="contained" 
            size="large"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            Sign in with Microsoft
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;