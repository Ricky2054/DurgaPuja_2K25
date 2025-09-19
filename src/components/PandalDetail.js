import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pujoLocations, trafficPatterns } from '../data/pujoData';
import TrafficAnimation from './TrafficAnimation';

const PandalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pujo, setPujo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPujo = pujoLocations.find(p => p.id === parseInt(id));
    if (foundPujo) {
      setPujo(foundPujo);
    }
    setLoading(false);
  }, [id]);

  const handleBackClick = () => {
    navigate('/map');
  };

  if (loading) {
    return (
      <div className="pandal-detail-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#7f8c8d' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!pujo) {
    return (
      <div className="pandal-detail-container">
        <button className="back-button" onClick={handleBackClick}>
          ← মানচিত্রে ফিরুন | Back to Map
        </button>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#e74c3c' }}>Pandal not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pandal-detail-container">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Map
      </button>

      <div className="pandal-info">
        <h2>{pujo.name}</h2>
        <p>{pujo.description}</p>
        <div className="features-list">
          {pujo.features.map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="traffic-animation-container">
        <h3>
          <span className="bengali-text">ট্র্যাফিক ফ্লো এবং পার্কিং এরিয়া</span>
          <br />
          <span className="english-text">Traffic Flow & Parking Areas</span>
        </h3>
        <TrafficAnimation pujoId={pujo.id} pujoName={pujo.name} />
        <div className="parking-legend">
          <div className="legend-item">
            <div className="legend-color general-parking"></div>
            <span>
              <span className="bengali-text">সাধারণ পার্কিং</span>
              <br />
              <span className="english-text">General Parking</span>
            </span>
          </div>
          <div className="legend-item">
            <div className="legend-color vip-parking"></div>
            <span>
              <span className="bengali-text">ভিআইপি পার্কিং</span>
              <br />
              <span className="english-text">VIP Parking</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandalDetail;
