import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Navbar"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Listing from './components/Listing';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat'


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />}/>
      </Routes>
    </div>
  );
}

export default App;
