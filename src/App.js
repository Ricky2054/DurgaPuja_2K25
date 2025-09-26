import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapView from './components/MapView';
import PandalDetail from './components/PandalDetail';
import PandalPage from './components/PandalPage';
import TrafficFlow from './components/TrafficFlow';
import HomePage from './components/HomePage';
import AllPandalsPage from './components/AllPandalsPage';
import AboutUs from './components/AboutUs';
import SoundEffects from './components/SoundEffects';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <SoundEffects />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/pandal/:id" element={<PandalDetail />} />
                <Route path="/pandal-page/:id" element={<PandalPage />} />
                <Route path="/traffic-flow/:id" element={<TrafficFlow />} />
                <Route path="/all-pandals" element={<AllPandalsPage />} />
                <Route path="/about-us" element={<AboutUs />} />
              </Routes>
      </div>
    </Router>
  );
}

export default App;
