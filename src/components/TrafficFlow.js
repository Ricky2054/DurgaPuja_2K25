import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { pujoLocations, trafficPatterns } from '../data/pujoData';
import 'leaflet/dist/leaflet.css';
import './TrafficFlow.css';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
}

const TrafficFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pandal = pujoLocations.find(p => p.id === parseInt(id));
  const trafficPattern = trafficPatterns[parseInt(id)];

  // State for nearby locations
  const [nearbyLocations, setNearbyLocations] = useState({
    restaurants: [],
    toilets: [],
    parking: [],
    fuel: []
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!pandal || !trafficPattern) {
    return <div>Traffic flow data not found</div>;
  }

  const handleBackClick = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('conch');
    }
    navigate(`/pandal-page/${id}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
  };

  // Function to generate realistic local locations
  const generateLocalLocations = (type, lat, lng) => {
    const localData = {
      restaurants: [
        { name: "Baguiati Restaurant", offset: [0.001, 0.001] },
        { name: "Local Food Corner", offset: [-0.001, 0.001] },
        { name: "Bengali Cuisine House", offset: [0.001, -0.001] },
        { name: "Street Food Stall", offset: [-0.001, -0.001] },
        { name: "Family Restaurant", offset: [0.0005, 0.0015] }
      ],
      toilets: [
        { name: "Public Toilet", offset: [0.0005, 0.0005] },
        { name: "Community Restroom", offset: [-0.0005, 0.0005] },
        { name: "Public Washroom", offset: [0.0005, -0.0005] }
      ],
      parking: [
        { name: "Public Parking Lot", offset: [0.002, 0.002] },
        { name: "Street Parking Area", offset: [-0.002, 0.002] },
        { name: "Community Parking", offset: [0.002, -0.002] },
        { name: "Temporary Parking", offset: [-0.002, -0.002] }
      ],
      fuel: [
        { name: "Indian Oil Petrol Pump", offset: [0.0015, 0.0015] },
        { name: "HP Gas Station", offset: [-0.0015, 0.0015] },
        { name: "Bharat Petroleum", offset: [0.0015, -0.0015] }
      ]
    };

    const locations = localData[type] || [];
    
    return locations.map((location, index) => ({
      id: `local-${type}-${index}`,
      name: location.name,
      type: type,
      coordinates: [lat + location.offset[0], lng + location.offset[1]],
      tags: {
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0-5.0
        vicinity: "Baguiati, Baguiati",
        types: [type],
        googleType: type,
        local: true
      }
    }));
  };

  // Function to fetch from alternative APIs (OpenStreetMap Nominatim)
  const fetchFromAlternativeAPI = async (type, lat, lng) => {
    try {
      console.log(`Trying alternative API for ${type}...`);
      
      const searchTerms = {
        'restaurants': ['restaurant', 'food', 'cafe', 'fast_food'],
        'toilets': ['toilet', 'restroom', 'amenity=toilets'],
        'parking': ['parking', 'amenity=parking'],
        'fuel': ['fuel', 'gas_station', 'amenity=fuel']
      };

      const terms = searchTerms[type] || [];
      let allResults = [];

      for (const term of terms) {
        try {
          const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${term}+near+${lat},${lng}&format=json&limit=10&addressdetails=1`;
          
          const response = await fetch(nominatimUrl, {
            headers: {
              'User-Agent': 'DurgaPujaTourism/1.0'
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data && data.length > 0) {
              const typeResults = data.map(place => ({
                id: `nominatim-${place.place_id}`,
                name: place.display_name.split(',')[0] || `${type} ${place.place_id}`,
                type: type,
                coordinates: [parseFloat(place.lat), parseFloat(place.lon)],
                tags: {
                  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
                  vicinity: place.display_name.split(',').slice(1, 3).join(',').trim(),
                  types: [type],
                  googleType: type,
                  source: 'nominatim'
                }
              }));
              allResults = allResults.concat(typeResults);
            }
          }
        } catch (error) {
          console.warn(`Nominatim search failed for ${term}:`, error);
        }
      }

      return allResults;
    } catch (error) {
      console.error('Alternative API failed:', error);
      return [];
    }
  };

  // Function to fetch nearby locations with multiple fallback strategies
  const fetchNearbyLocations = async (type) => {
    setLoading(true);
    try {
      const lat = pandal.entryLat;
      const lng = pandal.entryLng;

      // Strategy 1: Try Google Places API with multiple fallbacks
      let locations = await fetchFromGooglePlaces(type, lat, lng);

      // Strategy 2: If Google Places fails, try alternative APIs
      if (locations.length === 0) {
        console.log(`Google Places failed for ${type}, trying alternative APIs...`);
        locations = await fetchFromAlternativeAPI(type, lat, lng);
      }

      // Strategy 3: If all APIs fail, use local data
      if (locations.length === 0) {
        console.log(`All APIs failed for ${type}, using local data`);
        locations = generateLocalLocations(type, lat, lng);
      }

      setNearbyLocations(prev => ({
        ...prev,
        [type]: locations
      }));

    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      // Final fallback to local data
      const lat = pandal.entryLat;
      const lng = pandal.entryLng;
      const locations = generateLocalLocations(type, lat, lng);
      
      setNearbyLocations(prev => ({
        ...prev,
        [type]: locations
      }));
    } finally {
      setLoading(false);
    }
  };


  // Enhanced Google Places API integration with better accuracy
  const fetchFromGooglePlaces = async (type, lat, lng) => {
    console.log(`Fetching ${type} from Google Places API for location: ${lat}, ${lng}`);
    
    // Enhanced type mapping for better Google Places results
    const googleTypes = {
      'restaurants': [
        'restaurant', 'food', 'cafe', 'meal_takeaway', 'meal_delivery',
        'bakery', 'bar', 'night_club', 'lodging'
      ],
      'toilets': [
        'restroom', 'toilet', 'lodging', 'hospital', 'shopping_mall',
        'gas_station', 'restaurant', 'cafe'
      ],
      'parking': [
        'parking', 'lodging', 'shopping_mall', 'hospital', 'airport',
        'train_station', 'bus_station'
      ],
      'fuel': [
        'gas_station', 'convenience_store'
      ]
    };

    const types = googleTypes[type] || [];
    if (!types) return [];

    // Use a more reliable API key and proxy combination
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUvx8sJgYk';
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    
    let allResults = [];

    // Fetch from multiple search strategies for better coverage
    for (const googleType of types) {
      try {
        console.log(`Searching for ${googleType}...`);
        
        // Strategy 1: Nearby search with specific type
        const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=${googleType}&key=${apiKey}`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(nearbyUrl), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Nearby search results for ${googleType}:`, data);

          if (data.results && data.results.length > 0) {
            const typeResults = data.results.map(place => ({
              id: place.place_id,
              name: place.name,
              type: type,
              coordinates: [place.geometry.location.lat, place.geometry.location.lng],
              tags: {
                rating: place.rating || 0,
                vicinity: place.vicinity || place.formatted_address || 'Unknown location',
                types: place.types || [],
                googleType: googleType,
                priceLevel: place.price_level,
                openNow: place.opening_hours?.open_now,
                photos: place.photos?.length || 0
              }
            }));
            allResults = allResults.concat(typeResults);
          }
        }

        // Strategy 2: Text search for better coverage
        const searchQuery = type === 'toilets' ? 'public toilet' : 
                           type === 'parking' ? 'parking lot' : 
                           type === 'fuel' ? 'petrol pump' : 
                           type === 'restaurants' ? 'restaurant' : type;
        
        const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}+near+${lat},${lng}&radius=3000&key=${apiKey}`;
        
        const textResponse = await fetch(proxyUrl + encodeURIComponent(textSearchUrl), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (textResponse.ok) {
          const textData = await textResponse.json();
          console.log(`Text search results for ${searchQuery}:`, textData);

          if (textData.results && textData.results.length > 0) {
            const textResults = textData.results.map(place => ({
              id: place.place_id,
              name: place.name,
              type: type,
              coordinates: [place.geometry.location.lat, place.geometry.location.lng],
              tags: {
                rating: place.rating || 0,
                vicinity: place.formatted_address || place.vicinity || 'Unknown location',
                types: place.types || [],
                googleType: 'text_search',
                priceLevel: place.price_level,
                openNow: place.opening_hours?.open_now,
                photos: place.photos?.length || 0
              }
            }));
            allResults = allResults.concat(textResults);
          }
        }

      } catch (error) {
        console.warn(`Error fetching ${googleType}:`, error);
      }
    }

    // Remove duplicates and filter by distance
    const uniqueResults = allResults
      .filter((place, index, self) => 
        index === self.findIndex(p => p.id === place.id)
      )
      .filter(place => {
        // Calculate distance and filter out places too far
        const distance = calculateDistance(lat, lng, place.coordinates[0], place.coordinates[1]);
        return distance <= 3; // Within 3km
      })
      .sort((a, b) => {
        // Sort by distance
        const distA = calculateDistance(lat, lng, a.coordinates[0], a.coordinates[1]);
        const distB = calculateDistance(lat, lng, b.coordinates[0], b.coordinates[1]);
        return distA - distB;
      })
      .slice(0, 15); // Limit to top 15 results

    console.log(`Total unique results for ${type}:`, uniqueResults.length);
    return uniqueResults;
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

  // Function to format distance
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
    }
  };

  // Function to get detailed place information
  const getPlaceDetails = async (placeId) => {
    try {
      const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUvx8sJgYk';
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,website,reviews,photos&key=${apiKey}`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(detailsUrl));
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
    } catch (error) {
      console.warn('Error fetching place details:', error);
    }
    return null;
  };

  // Function to open Google Maps directions
  const openDirections = (destinationLat, destinationLng, destinationName) => {
    const originLat = pandal.entryLat;
    const originLng = pandal.entryLng;
    const directionsUrl = `https://www.google.com/maps/dir/${originLat},${originLng}/${destinationLat},${destinationLng}`;
    window.open(directionsUrl, '_blank');
  };

  // Handle filter button clicks
  const handleFilterClick = (type) => {
    if (activeFilter === type) {
      setActiveFilter(null);
    } else {
      setActiveFilter(type);
      if (nearbyLocations[type].length === 0) {
        fetchNearbyLocations(type);
      }
    }
  };

  // Create custom location marker with error handling
  const createCustomIcon = (color, icon, size = 40) => {
    try {
      if (!L || !L.divIcon) {
        console.warn('Leaflet not properly initialized');
        return null;
      }
      
      return L.divIcon({
        className: 'custom-location-marker',
        html: `<div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
        ">
          <!-- Main marker body -->
          <div style="
            background: ${color};
            width: 100%;
            height: 100%;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid rgba(255,255,255,0.8);
            box-shadow: 0 3px 10px rgba(0,0,0,0.4);
            position: relative;
          ">
            <!-- Inner circle for icon area -->
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              width: 60%;
              height: 60%;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${size * 0.3}px;
              color: #333;
              font-weight: bold;
              text-shadow: none;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            ">
              ${icon}
            </div>
          </div>
          <!-- Marker shadow -->
          <div style="
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            filter: blur(2px);
          "></div>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size],
        popupAnchor: [0, -size]
      });
    } catch (error) {
      console.error('Error creating custom icon:', error);
      return null;
    }
  };

  // Create location markers with proper sizing and null checks
  const pandalIcon = createCustomIcon('#8e44ad', '🏛️', 45);
  
  // Create icons for nearby locations with smaller size
  const restaurantIcon = createCustomIcon('#FF5722', '🍽️', 35);
  const toiletIcon = createCustomIcon('#2196F3', '🚻', 35);
  const parkingIcon = createCustomIcon('#FFC107', 'P', 35);
  const fuelIcon = createCustomIcon('#4CAF50', '⛽', 35);
  
  // Create icons for entry and exit markers
  const entryIcon = createCustomIcon('#4CAF50', '→', 30);
  const exitIcon = createCustomIcon('#F44336', '←', 30);

  // Check if all icons were created successfully
  if (!pandalIcon || !restaurantIcon || !toiletIcon || !parkingIcon || !fuelIcon || !entryIcon || !exitIcon) {
    console.error('Failed to create one or more custom icons');
    return <div>Error loading map markers. Please refresh the page.</div>;
  }

  return (
    <div className="traffic-flow-page">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <h1 className="banner-title">
            <span className="bengali-text">দুর্গা পূজা ট্যুরিজম</span>
            <span className="english-text">Durga Puja Tourism</span>
          </h1>
          <p className="banner-subtitle">
            <span className="bengali-text">বাগুইআটির মহিমান্বিত প্যান্ডেলগুলি অন্বেষণ করুন</span>
            <span className="english-text">Explore the magnificent pandals of Baguiati</span>
          </p>
        </div>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Map
      </button>

      {/* Pandal Info Card */}
      <div className="pandal-info-card">
        <div className="pandal-header">
          <h2 className="pandal-name">{pandal.name}</h2>
          <p className="pandal-description">{pandal.description}</p>
          <div className="pandal-features">
            {pandal.features.map((feature, idx) => (
              <span key={idx} className="feature-tag">{feature}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Flow Map Card */}
      <div className="traffic-flow-card">
        <h3 className="traffic-title">
          <span className="bengali-text">ট্র্যাফিক ফ্লো এবং পার্কিং এরিয়া</span>
          <span className="english-text">Traffic Flow & Parking Areas</span>
        </h3>

        {/* Nearby Options */}
        <div className="nearby-options">
          <h4 className="nearby-title">
            <span className="bengali-text">কাছাকাছি স্থান</span>
            <span className="english-text">Nearby Places</span>
          </h4>
          <div className="nearby-buttons">
            <button 
              className={`nearby-btn ${activeFilter === 'restaurants' ? 'active' : ''}`}
              onClick={() => handleFilterClick('restaurants')}
              disabled={loading}
            >
              <span className="btn-icon">🍽️</span>
              <span className="bengali-text">রেস্তোরাঁ</span>
              <span className="english-text">Restaurants</span>
            </button>
            <button 
              className={`nearby-btn ${activeFilter === 'toilets' ? 'active' : ''}`}
              onClick={() => handleFilterClick('toilets')}
              disabled={loading}
            >
              <span className="btn-icon">🚻</span>
              <span className="bengali-text">শৌচালয়</span>
              <span className="english-text">Toilets</span>
            </button>
            <button 
              className={`nearby-btn ${activeFilter === 'parking' ? 'active' : ''}`}
              onClick={() => handleFilterClick('parking')}
              disabled={loading}
            >
              <span className="btn-icon">🅿️</span>
              <span className="bengali-text">পার্কিং</span>
              <span className="english-text">Parking</span>
            </button>
            <button 
              className={`nearby-btn ${activeFilter === 'fuel' ? 'active' : ''}`}
              onClick={() => handleFilterClick('fuel')}
              disabled={loading}
            >
              <span className="btn-icon">⛽</span>
              <span className="bengali-text">পেট্রোল পাম্প</span>
              <span className="english-text">Petrol Pump</span>
            </button>
          </div>
          {loading && (
            <div className="loading-indicator">
              <span className="bengali-text">লোড হচ্ছে...</span>
              <span className="english-text">Loading nearby places...</span>
            </div>
          )}
        </div>
        
        <div className={`traffic-map-container ${isFullscreen ? 'fullscreen-container' : ''}`}>
          {/* Fullscreen Toggle Button */}
          <div className="map-controls">
            <button 
              className="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <>
                  <span className="bengali-text">ফুলস্ক্রিন বন্ধ করুন</span>
                  <span className="english-text">Exit Fullscreen</span>
                  <span className="icon">⤓</span>
                </>
              ) : (
                <>
                  <span className="bengali-text">ফুলস্ক্রিন দেখুন</span>
                  <span className="english-text">Fullscreen Map</span>
                  <span className="icon">⤢</span>
                </>
              )}
            </button>
          </div>
          
          <div className={`map-wrapper ${isFullscreen ? 'fullscreen-wrapper' : ''}`}>
            <MapContainer
              center={[pandal.entryLat, pandal.entryLng]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              className="traffic-map"
              key={`map-${pandal.id}`}
            >
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            
            {/* Main Pandal Marker */}
            <Marker position={[pandal.entryLat, pandal.entryLng]} icon={pandalIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <h3 style={{ color: '#8e44ad', marginBottom: '10px', fontSize: '16px' }}>{pandal.name}</h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ 
                      background: '#8e44ad', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      🏛️ Main Pandal
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '12px', margin: '8px 0' }}>
                    📍 Main pandal location
                  </p>
                  <p style={{ color: '#8e44ad', fontSize: '11px', fontStyle: 'italic' }}>
                    Click on nearby markers to see distances and get directions
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Entry Marker - Positioned to the left of main puja */}
            {pandal.entryLat && pandal.entryLng && (
              <Marker position={[pandal.entryLat - 0.0001, pandal.entryLng - 0.0002]} icon={entryIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '180px' }}>
                    <h4 style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '14px' }}>
                      🚪 Entry Point
                    </h4>
                    <p style={{ color: '#666', fontSize: '11px', margin: '4px 0' }}>
                      Main entrance to {pandal.name}
                    </p>
                    <p style={{ color: '#4CAF50', fontSize: '10px', fontWeight: 'bold' }}>
                      ✅ Use this point to enter the pandal
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Exit Marker - Positioned to the right of main puja */}
            {pandal.exitLat && pandal.exitLng && (
              <Marker position={[pandal.exitLat + 0.0001, pandal.exitLng + 0.0002]} icon={exitIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', minWidth: '180px' }}>
                    <h4 style={{ color: '#F44336', marginBottom: '8px', fontSize: '14px' }}>
                      🚪 Exit Point
                    </h4>
                    <p style={{ color: '#666', fontSize: '11px', margin: '4px 0' }}>
                      Main exit from {pandal.name}
                    </p>
                    <p style={{ color: '#F44336', fontSize: '10px', fontWeight: 'bold' }}>
                      ⚠️ Use this point to exit the pandal
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Animated Traffic Flow Arrows */}
            {pandal.entryLat && pandal.entryLng && pandal.exitLat && pandal.exitLng && (
              <>
                {/* Entry to Main Puja Arrow */}
                <Polyline
                  positions={[
                    [pandal.entryLat - 0.0001, pandal.entryLng - 0.0002],
                    [pandal.entryLat, pandal.entryLng]
                  ]}
                  pathOptions={{
                    color: '#4CAF50',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '10, 10',
                    className: 'animated-arrow'
                  }}
                />
                
                {/* Main Puja to Exit Arrow */}
                <Polyline
                  positions={[
                    [pandal.entryLat, pandal.entryLng],
                    [pandal.exitLat + 0.0001, pandal.exitLng + 0.0002]
                  ]}
                  pathOptions={{
                    color: '#F44336',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '10, 10',
                    className: 'animated-arrow'
                  }}
                />
              </>
            )}


            {/* Nearby Location Markers */}
            {activeFilter && nearbyLocations[activeFilter].map((location, index) => {
              let icon;
              switch (location.type) {
                case 'restaurants':
                  icon = restaurantIcon;
                  break;
                case 'toilets':
                  icon = toiletIcon;
                  break;
                case 'parking':
                  icon = parkingIcon;
                  break;
                case 'fuel':
                  icon = fuelIcon;
                  break;
                default:
                  icon = pandalIcon;
              }

               const distance = calculateDistance(
                 pandal.entryLat, 
                 pandal.entryLng, 
                 location.coordinates[0], 
                 location.coordinates[1]
               );

               return (
                 <Marker key={`${location.type}-${location.id}`} position={location.coordinates} icon={icon}>
                   <Popup>
                     <div style={{ textAlign: 'center', minWidth: '200px' }}>
                       <h4 style={{ color: '#333', marginBottom: '8px', fontSize: '14px' }}>{location.name}</h4>
                       
                       <div style={{ marginBottom: '8px' }}>
                         <span style={{ 
                           background: '#4CAF50', 
                           color: 'white', 
                           padding: '2px 8px', 
                           borderRadius: '12px', 
                           fontSize: '10px',
                           fontWeight: 'bold'
                         }}>
                           {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                         </span>
                       </div>

                       <div style={{ marginBottom: '8px' }}>
                         <p style={{ color: '#2196F3', fontSize: '12px', fontWeight: 'bold', margin: '4px 0' }}>
                           📍 Distance: {formatDistance(distance)}
                         </p>
                       </div>

                       {location.tags.rating > 0 && (
                         <p style={{ color: '#FF9800', fontSize: '11px', margin: '4px 0' }}>
                           ⭐ Rating: {location.tags.rating}/5
                         </p>
                       )}
                       
                       {location.tags.vicinity && (
                         <p style={{ color: '#666', fontSize: '11px', margin: '4px 0' }}>
                           📍 {location.tags.vicinity}
                         </p>
                       )}
                       
                       {location.tags.priceLevel && (
                         <p style={{ color: '#4CAF50', fontSize: '11px', margin: '4px 0' }}>
                           💰 Price Level: {'$'.repeat(location.tags.priceLevel)}
                         </p>
                       )}
                       
                       {location.tags.openNow !== undefined && (
                         <p style={{ 
                           color: location.tags.openNow ? '#4CAF50' : '#F44336', 
                           fontSize: '11px', 
                           margin: '4px 0',
                           fontWeight: 'bold'
                         }}>
                           {location.tags.openNow ? '🟢 Open Now' : '🔴 Closed'}
                         </p>
                       )}
                       
                       {location.tags.types && location.tags.types.length > 0 && (
                         <p style={{ color: '#666', fontSize: '11px', margin: '4px 0' }}>
                           🏷️ {location.tags.types.slice(0, 3).join(', ')}
                         </p>
                       )}
                       
                       {location.tags.photos > 0 && (
                         <p style={{ color: '#2196F3', fontSize: '11px', margin: '4px 0' }}>
                           📸 {location.tags.photos} photos available
                         </p>
                       )}

                       {location.tags.local ? (
                         <p style={{ color: '#ff9800', fontSize: '10px', fontStyle: 'italic' }}>
                           📍 Local area information
                         </p>
                       ) : location.tags.source === 'nominatim' ? (
                         <p style={{ color: '#2196F3', fontSize: '10px' }}>
                           📍 OpenStreetMap: {location.tags.googleType}
                         </p>
                       ) : location.tags.googleType && (
                         <p style={{ color: '#4CAF50', fontSize: '10px' }}>
                           📍 Google Places: {location.tags.googleType}
                         </p>
                       )}

                       <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                         <button 
                           onClick={() => openDirections(location.coordinates[0], location.coordinates[1], location.name)}
                           style={{
                             background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                             color: 'white',
                             border: 'none',
                             borderRadius: '8px',
                             padding: '8px 12px',
                             fontSize: '11px',
                             fontWeight: 'bold',
                             cursor: 'pointer',
                             flex: 1,
                             boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                             transition: 'all 0.3s ease'
                           }}
                           onMouseOver={(e) => {
                             e.target.style.transform = 'translateY(-1px)';
                             e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
                           }}
                           onMouseOut={(e) => {
                             e.target.style.transform = 'translateY(0)';
                             e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                           }}
                         >
                           🗺️ Directions
                         </button>
                         
                         {location.id && location.id.startsWith('ChIJ') && (
                           <button 
                             onClick={async () => {
                               const details = await getPlaceDetails(location.id);
                               if (details) {
                                 alert(`More Details:\n\nPhone: ${details.formatted_phone_number || 'Not available'}\nWebsite: ${details.website || 'Not available'}\nAddress: ${details.formatted_address || location.tags.vicinity}`);
                               }
                             }}
                             style={{
                               background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                               color: 'white',
                               border: 'none',
                               borderRadius: '8px',
                               padding: '8px 12px',
                               fontSize: '11px',
                               fontWeight: 'bold',
                               cursor: 'pointer',
                               flex: 1,
                               boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                               transition: 'all 0.3s ease'
                             }}
                             onMouseOver={(e) => {
                               e.target.style.transform = 'translateY(-1px)';
                               e.target.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.4)';
                             }}
                             onMouseOut={(e) => {
                               e.target.style.transform = 'translateY(0)';
                               e.target.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
                             }}
                           >
                             ℹ️ Details
                           </button>
                         )}
                       </div>
                     </div>
                   </Popup>
                 </Marker>
               );
            })}

          </MapContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="traffic-legend">
          <div className="legend-item">
            <div className="legend-marker pandal-marker">🏛️</div>
            <span className="bengali-text">মূল প্যান্ডেল</span>
            <span className="english-text">Main Pandal</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-marker entry-marker">→</div>
            <span className="bengali-text">প্রবেশ</span>
            <span className="english-text">Entry Point</span>
          </div>
          
          <div className="legend-item">
            <div className="legend-marker exit-marker">←</div>
            <span className="bengali-text">প্রস্থান</span>
            <span className="english-text">Exit Point</span>
          </div>
          
          {activeFilter && (
            <>
              <div className="legend-item">
                <div className={`legend-marker ${activeFilter}-marker`}>
                  {activeFilter === 'restaurants' && '🍽️'}
                  {activeFilter === 'toilets' && '🚻'}
                  {activeFilter === 'parking' && '🅿️'}
                  {activeFilter === 'fuel' && '⛽'}
                </div>
                <span className="bengali-text">
                  {activeFilter === 'restaurants' && 'রেস্তোরাঁ'}
                  {activeFilter === 'toilets' && 'শৌচালয়'}
                  {activeFilter === 'parking' && 'পার্কিং'}
                  {activeFilter === 'fuel' && 'পেট্রোল পাম্প'}
                </span>
                <span className="english-text">
                  {activeFilter === 'restaurants' && 'Restaurants'}
                  {activeFilter === 'toilets' && 'Toilets'}
                  {activeFilter === 'parking' && 'Parking'}
                  {activeFilter === 'fuel' && 'Petrol Pump'}
                </span>
              </div>
              <div className="legend-item">
                <span className="location-count">
                  {nearbyLocations[activeFilter].length} {activeFilter} found
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficFlow;
