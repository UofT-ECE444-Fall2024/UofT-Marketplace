import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ListingsGrid from './pages/ListingsPage';
import ListingDetail from './pages/ListingDetail';
// import NotFound from './NotFound'; // 404 Not Found component
import { useStytchUser } from "@stytch/react";

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  const { user } = useStytchUser();

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Auth />} />
      <Route path="/home" element={<WithNavbar><ListingsGrid /></WithNavbar>} />
        <Route path="/listings/:id" element={<WithNavbar><ListingDetail /></WithNavbar>} /> {/* Dynamic route for listing details /}
        {/ <Route path="*" element={<NotFound />} /> Catch-all for 404 errors */}
        <Route path="/chat" element={<WithNavbar><Chat /></WithNavbar>} />
        <Route path="/profile" element={<WithNavbar><Profile /></WithNavbar>} />
        <Route path="/landing" element={<WithNavbar><Landing /></WithNavbar>} />

      </Routes>
    </div>
  );
}

export default App;