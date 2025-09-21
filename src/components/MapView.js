import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { pujoLocations } from '../data/pujoData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
}

const MapView = () => {
  const navigate = useNavigate();
  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPandals, setNearbyPandals] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleBackClick = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('conch');
    }
    navigate('/');
  };

  // Create custom marker icon with error handling
  const createCustomIcon = (index) => {
    try {
      if (!L || !L.divIcon) {
        console.warn('Leaflet not properly initialized');
        return null;
      }
      
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
    } catch (error) {
      console.error('Error creating custom icon:', error);
      return null;
    }
  };

  const handleMarkerClick = (pujoId) => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    navigate(`/pandal-page/${pujoId}`);
  };

  // Function to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Function to find nearby pandals
  const findNearbyPandals = (userLat, userLng, radiusKm = 5) => {
    const nearby = pujoLocations
      .map(pandal => ({
        ...pandal,
        distance: calculateDistance(userLat, userLng, pandal.entryLat, pandal.entryLng)
      }))
      .filter(pandal => pandal.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Show top 10 nearest pandals
    
    setNearbyPandals(nearby);
  };

  // Function to get user's current location
  const locateUser = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        findNearbyPandals(latitude, longitude);
        
        // Center map on user location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
        
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Create user location marker icon with error handling
  const createUserLocationIcon = () => {
    try {
      if (!L || !L.divIcon) {
        console.warn('Leaflet not properly initialized');
        return null;
      }
      
      return L.divIcon({
        className: 'user-location-marker',
        html: `<div style="
          background: #3498db;
          border: 4px solid #fff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.3);
          animation: userLocationPulse 2s infinite;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });
    } catch (error) {
      console.error('Error creating user location icon:', error);
      return null;
    }
  };

  // Calculate center point of all locations
  const centerLat = pujoLocations.reduce((sum, pujo) => sum + pujo.entryLat, 0) / pujoLocations.length;
  const centerLng = pujoLocations.reduce((sum, pujo) => sum + pujo.entryLng, 0) / pujoLocations.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem' }}>
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Home
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={locateUser}
            disabled={isLocating}
            style={{
              background: isLocating ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLocating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!isLocating) {
                e.target.style.background = '#2980b9';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLocating) {
                e.target.style.background = '#3498db';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
              }
            }}
          >
            {isLocating ? '🔄 Locating...' : '📍 Locate Me'}
          </button>
          
          {nearbyPandals.length > 0 && (
            <div style={{
              background: 'rgba(52, 152, 219, 0.1)',
              border: '1px solid #3498db',
              borderRadius: '15px',
              padding: '0.5rem 1rem',
              color: '#3498db',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {nearbyPandals.length} nearby pandals
            </div>
          )}
        </div>
      </div>
      
      {locationError && (
        <div style={{
          background: '#e74c3c',
          color: 'white',
          padding: '0.75rem 1rem',
          margin: '0 1rem 1rem 1rem',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          ⚠️ {locationError}
        </div>
      )}
      
      <div className="map-container">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <h3 style={{ color: '#3498db', marginBottom: '10px', fontSize: '16px' }}>
                  📍 Your Location
                </h3>
                <p style={{ color: '#666', fontSize: '12px', margin: '8px 0' }}>
                  You are here! Find nearby pandals below.
                </p>
                {nearbyPandals.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ color: '#3498db', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>
                      Nearest Pandals:
                    </p>
                    {nearbyPandals.slice(0, 3).map((pandal, idx) => (
                      <div key={pandal.id} style={{ 
                        background: '#f8f9fa', 
                        padding: '5px 8px', 
                        margin: '2px 0', 
                        borderRadius: '8px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleMarkerClick(pandal.id)}
                      >
                        {pandal.name} ({pandal.distance.toFixed(1)}km)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
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
      
      {/* Nearby Pandals List */}
      {nearbyPandals.length > 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '2rem',
          margin: '2rem 1rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              color: '#ffeb3b', 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              📍 Nearby Pandals
            </h2>
            <p style={{ 
              color: 'white', 
              fontSize: '1rem', 
              opacity: 0.9 
            }}>
              Found {nearbyPandals.length} pandals within 5km of your location
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {nearbyPandals.map((pandal, index) => (
              <div
                key={pandal.id}
                onClick={() => handleMarkerClick(pandal.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {/* Distance Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                }}>
                  {pandal.distance.toFixed(1)} km
                </div>
                
                {/* Pandal Number */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
                }}>
                  {pandal.id}
                </div>
                
                {/* Pandal Name */}
                <h3 style={{
                  color: '#ffeb3b',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  marginTop: '3rem',
                  lineHeight: '1.3',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  {pandal.name}
                </h3>
                
                {/* Description */}
                <p style={{
                  color: 'white',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  opacity: 0.9,
                  lineHeight: '1.4'
                }}>
                  {pandal.description}
                </p>
                
                {/* Features */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {pandal.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                  {pandal.features.length > 3 && (
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      +{pandal.features.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Address */}
                <p style={{
                  color: '#bdc3c7',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                  fontStyle: 'italic'
                }}>
                  📍 {pandal.address}
                </p>
                
                {/* View Details Button */}
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '0.8rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
                  }}
                >
                  View Details & Traffic Flow
                </button>
              </div>
            ))}
          </div>
          
          {/* Show More Button if there are more than 6 pandals */}
          {nearbyPandals.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ 
                color: '#bdc3c7', 
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                Showing {Math.min(6, nearbyPandals.length)} of {nearbyPandals.length} nearby pandals
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;
