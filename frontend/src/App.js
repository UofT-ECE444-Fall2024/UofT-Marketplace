import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ListingsGrid from './pages/ListingsPage';
import ListingDetail from './pages/ListingDetail';
import { useStytchUser } from "@stytch/react";
import RatingTest from './components/ratings/RatingTest';
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const ProtectedRouteWithNavbar = ({ children }) => (
  <ProtectedRoute>
    <WithNavbar>{children}</WithNavbar>
  </ProtectedRoute>
);

function App() {
  const { user } = useStytchUser();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Auth />} />
        
        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRouteWithNavbar>
              <ListingsGrid />
            </ProtectedRouteWithNavbar>
          } 
        />
        <Route 
          path="/listings/:id" 
          element={
            <ProtectedRouteWithNavbar>
              <ListingDetail />
            </ProtectedRouteWithNavbar>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRouteWithNavbar>
              <ConversationsPage />
            </ProtectedRouteWithNavbar>
          } 
        />
        <Route 
          path="/chat/:conversationId" 
          element={
            <ProtectedRouteWithNavbar>
              <ChatPage />
            </ProtectedRouteWithNavbar>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRouteWithNavbar>
              <Profile />
            </ProtectedRouteWithNavbar>
          } 
        />
        <Route 
          path="/landing" 
          element={
            <ProtectedRouteWithNavbar>
              <Landing />
            </ProtectedRouteWithNavbar>
          } 
        />
        
        {/* Public route */}
        <Route path="/rate" element={<RatingTest username="admin" fullname="Admin"/>} />
      </Routes>
    </div>
  );
}

export default App;