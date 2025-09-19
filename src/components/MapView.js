import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { pujoLocations } from '../data/pujoData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = () => {
  const navigate = useNavigate();
  const mapRef = useRef();

  const handleBackClick = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('conch');
    }
    navigate('/');
  };

  // Create custom marker icon
  const createCustomIcon = (index) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border: 3px solid #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      ">${index}</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  const handleMarkerClick = (pujoId) => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    navigate(`/pandal-page/${pujoId}`);
  };

  // Calculate center point of all locations
  const centerLat = pujoLocations.reduce((sum, pujo) => sum + pujo.entryLat, 0) / pujoLocations.length;
  const centerLng = pujoLocations.reduce((sum, pujo) => sum + pujo.entryLng, 0) / pujoLocations.length;

  return (
    <div>
      <button className="back-button" onClick={handleBackClick} style={{ margin: '1rem' }}>
        ← Back to Home
      </button>
      <div className="map-container">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pujoLocations.map((pujo, index) => (
          <Marker
            key={pujo.id}
            position={[pujo.entryLat, pujo.entryLng]}
            icon={createCustomIcon(index + 1)}
            eventHandlers={{
              click: () => handleMarkerClick(pujo.id)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>
                  {pujo.name}
                </h3>
                <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '14px' }}>
                  {pujo.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                  {pujo.features.map((feature, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleMarkerClick(pujo.id)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#2980b9';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#3498db';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  View Details & Traffic
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
