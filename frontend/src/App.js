import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Auth from './components/Auth';
import ListingsGrid from './pages/ListingsPage';

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
        <Route path="/chat" element={<WithNavbar><Chat /></WithNavbar>} />
      </Routes>
    </div>
  );
}

export default App;