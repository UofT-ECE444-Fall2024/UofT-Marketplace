import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StytchUIClient } from "@stytch/vanilla-js";
import { StytchProvider } from "@stytch/react";

const stytch = new StytchUIClient(process.env.REACT_APP_STYTCH_PUBLIC_TOKEN);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StytchProvider stytch={stytch}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </StytchProvider>
  </React.StrictMode>
);
