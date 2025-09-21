import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapView from './components/MapView';
import PandalDetail from './components/PandalDetail';
import PandalPage from './components/PandalPage';
import TrafficFlow from './components/TrafficFlow';
import HomePage from './components/HomePage';
import SoundEffects from './components/SoundEffects';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <SoundEffects />
        <header className="app-header">
          <h1>🎭 দুর্গা পূজা ট্যুরিজম | Durga Puja Tourism</h1>
          <p>বাগুইআটির মহিমান্বিত প্যান্ডেলগুলি অন্বেষণ করুন | Explore the magnificent pandals of Baguiati</p>
        </header>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/pandal/:id" element={<PandalDetail />} />
                <Route path="/pandal-page/:id" element={<PandalPage />} />
                <Route path="/traffic-flow/:id" element={<TrafficFlow />} />
              </Routes>
      </div>
    </Router>
  );
}

export default App;
