import React from 'react';
import { StytchLogin, useStytch } from '@stytch/react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const client = useStytch();

  const config = {
    "products": ["otp"],
    "otpOptions": {
      "methods": ["email"],
      "expirationMinutes": 5
    }
  };

  const styles = {
    "container": {
      "backgroundColor": "#FFFFFF",
      "borderColor": "#ADBCC5",
      "borderRadius": "8px",
      "width": "400px"
    },
    "colors": {
      "primary": "#19303D",
      "secondary": "#5C727D",
      "success": "#0C5A56",
      "error": "#8B1214"
    },
    "buttons": {
      "primary": {
        "backgroundColor": "#19303D",
        "textColor": "#FFFFFF",
        "borderColor": "#19303D",
        "borderRadius": "4px"
      },
      "secondary": {
        "backgroundColor": "#FFFFFF",
        "textColor": "#19303D",
        "borderColor": "#19303D",
        "borderRadius": "4px"
      }
    },
    "inputs": {
      "backgroundColor": "#FFFFFF00",
      "borderColor": "#19303D",
      "borderRadius": "4px",
      "placeholderColor": "#8296A1",
      "textColor": "#19303D"
    },
    "fontFamily": "Arial",
    "hideHeaderText": false,
    "logo": {
      "logoImageUrl": ""
    }
  };
  const createOrUpdateUser = async (email) => {
    try {
      // Extract username from email (everything before @)
      const username = email.split('@')[0];
      
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          auth_type: 'stytch',
          verified: true // Since they verified their email through Stytch
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      // Store user data in localStorage for future use
      localStorage.setItem('userData', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  };
  
  // Callbacks for authentication events
  const callbacks = {
    onEvent: () => {

      const emailInput = document.getElementById('email-input');
      if (!emailInput || !emailInput.value) {
        return;
      }
      if (!emailInput.value.endsWith('@mail.utoronto.ca') && !emailInput.value.endsWith('@utoronto.ca')) {
        throw new Error("Please login with your utoronto email!"); 
      }
      else{
      createOrUpdateUser(emailInput.value);
      }
    },
    onSuccess: () => {
      // Navigate to home page on successful authentication
      navigate('/home');
    },
    onError: (error) => {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <StytchLogin 
          config={config} 
          styles={styles}
          callbacks={callbacks} 
        />
      </div>
    </div>
  );
};

export default Auth;