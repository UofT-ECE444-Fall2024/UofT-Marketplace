import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ListingsGrid from './pages/ListingsPage';
import ListingDetail from './pages/ListingDetail';
// import NotFound from './NotFound'; // 404 Not Found component
import RatingTest from './components/ratings/RatingTest'
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';

const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<WithNavbar><ListingsGrid /></WithNavbar>} />
        <Route path="/listings/:id" element={<WithNavbar><ListingDetail /></WithNavbar>} /> {/* Dynamic route for listing details */}
        {/* <Route path="*" element={<NotFound />} /> Catch-all for 404 errors */}
        <Route path="/chat" element={<WithNavbar><ConversationsPage /></WithNavbar>} />
        <Route path="/chat/:conversationId" element={<WithNavbar><ChatPage /></WithNavbar>} />
        <Route path="/profile" element={<WithNavbar><Profile /></WithNavbar>} />
        <Route path="/landing" element={<WithNavbar><Landing /></WithNavbar>} />
        {/* The following route is temporary */}
        <Route path="/rate" element={<RatingTest username="admin" fullname="Admin"/>} />
      </Routes>
    </div>
  );
}

export default App;