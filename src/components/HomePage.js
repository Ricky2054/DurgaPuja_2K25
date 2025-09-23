import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pujoLocations } from '../data/pujoData';
import InteractiveEffects from './InteractiveEffects';

const HomePage = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState({ temperature: '28.3°C', location: 'Baguiati, Kolkata' });
  const [selectedDistance, setSelectedDistance] = useState('1 KM');
  const [filteredPandals, setFilteredPandals] = useState(pujoLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied or error:', error);
          // Default to Baguiati center if location access is denied
          setUserLocation({
            lat: 22.6128691,
            lng: 88.4233409
          });
        }
      );
    }
  }, []);

  const handleExploreMap = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('dhak');
    }
    navigate('/map');
  };

  const handlePandalClick = (pujoId) => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    navigate(`/pandal-page/${pujoId}`);
  };

  const handleEmergencyCall = (service) => {
    const numbers = {
      ambulance: '108',
      police: '100',
      fire: '101'
    };
    
    // Show confirmation dialog
    const confirmCall = window.confirm(`Call ${service.toUpperCase()} at ${numbers[service]}?`);
    if (confirmCall) {
      window.open(`tel:${numbers[service]}`);
    }
  };

  const handleQuickAccess = (service) => {
    const services = {
      police: {
        name: 'Police Stations',
        locations: [
          { name: 'Baguiati Police Station', phone: '+91 33 2574 1234', address: 'Baguiati, Kolkata' },
          { name: 'New Town Police Station', phone: '+91 33 2321 5678', address: 'New Town, Kolkata' }
        ]
      },
      hospital: {
        name: 'Hospitals',
        locations: [
          { name: 'Baguiati Hospital', phone: '+91 33 2574 9999', address: 'Baguiati, Kolkata' },
          { name: 'Apollo Hospital', phone: '+91 33 2321 8888', address: 'New Town, Kolkata' }
        ]
      },
      bus: {
        name: 'Bus Stands',
        locations: [
          { name: 'Baguiati Bus Stand', address: 'VIP Road, Baguiati' },
          { name: 'New Town Bus Stand', address: 'New Town, Kolkata' }
        ]
      },
      metro: {
        name: 'Metro Stations',
        locations: [
          { name: 'Baguiati Metro Station', address: 'VIP Road, Baguiati' },
          { name: 'New Town Metro Station', address: 'New Town, Kolkata' }
        ]
      }
    };

    const serviceInfo = services[service];
    if (serviceInfo) {
      const message = `${serviceInfo.name}:\n\n${serviceInfo.locations.map(loc => 
        `${loc.name}\n${loc.address}${loc.phone ? `\nPhone: ${loc.phone}` : ''}`
      ).join('\n\n')}`;
      
      alert(message);
    }
  };

  const handleDistanceFilter = (distance) => {
    setSelectedDistance(distance);
    
    if (!userLocation) return;

    const distanceInKm = parseFloat(distance);
    const filtered = pujoLocations.filter(pandal => {
      const pandalDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        pandal.mainPujoLat,
        pandal.mainPujoLng
      );
      return pandalDistance <= distanceInKm;
    });
    
    setFilteredPandals(filtered);
  };

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

  const handleSearch = (query) => {
    if (query && query.trim()) {
      setSearchQuery(query);
      const filtered = pujoLocations.filter(pandal => 
        pandal.name.toLowerCase().includes(query.toLowerCase()) ||
        pandal.description.toLowerCase().includes(query.toLowerCase()) ||
        pandal.features.some(feature => feature.toLowerCase().includes(query.toLowerCase())) ||
        pandal.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPandals(filtered);
    } else {
      setSearchQuery('');
      setFilteredPandals(pujoLocations);
    }
  };

  const handleSocialMedia = (platform) => {
    const links = {
      facebook: 'https://www.facebook.com/BaguiatiDurgaPuja',
      twitter: 'https://www.twitter.com/BaguiatiPuja',
      instagram: 'https://www.instagram.com/baguiatidurgapuja'
    };
    
    if (links[platform]) {
      window.open(links[platform], '_blank');
    }
  };

  const handleEmergencyMain = () => {
    const emergencyOptions = [
      'Police: 100',
      'Ambulance: 108', 
      'Fire: 101',
      'Women Helpline: 1091',
      'Child Helpline: 1098'
    ];
    
    const selected = prompt(`Emergency Services:\n\n${emergencyOptions.map((opt, index) => `${index + 1}. ${opt}`).join('\n')}\n\nEnter number (1-5) or call directly:`);
    
    if (selected) {
      const numbers = ['100', '108', '101', '1091', '1098'];
      const index = parseInt(selected) - 1;
      if (index >= 0 && index < numbers.length) {
        window.open(`tel:${numbers[index]}`);
      }
    }
  };

  return (
    <div className="homepage-container">
      <InteractiveEffects />
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="bengali-text">বাগুইআটি দুর্গা পূজা পরিক্রমা</span>
            <br />
            <span className="english-text">Baguiati Durga Puja Parikrama</span>
          </h1>
          <p className="hero-subtitle">
            <span className="bengali-text">বাগুইআটির মহিমান্বিত প্যান্ডেলগুলি অন্বেষণ করুন</span>
            <br />
            <span className="english-text">Explore the magnificent pandals of Baguiati</span>
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">48</div>
              <div className="stat-label">Pandals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Authentic</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Guide</div>
            </div>
          </div>
          <button className="explore-button magnetic-btn" onClick={handleExploreMap}>
            <span className="bengali-text">পরিক্রমা শুরু করুন</span>
            <br />
            <span className="english-text">Start Parikrama</span>
          </button>
        </div>
        <div className="hero-image">
          <img 
            src="/images/durga-images/traditional puja.jpg" 
            alt="Durga Puja Celebration"
            className="circular-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="image-placeholder circular-image" style={{ display: 'none' }}>
            <div className="placeholder-content">
              <div className="placeholder-icon">🏛️</div>
              <p>Hero Image Placeholder</p>
              <small>Add your main hero image here</small>
            </div>
          </div>
        </div>
      </div>


      {/* Emergency Services Section */}
      <div className="emergency-services-section">
        <div className="emergency-grid">
          <button className="emergency-btn ambulance" onClick={() => handleEmergencyCall('ambulance')}>
            <div className="emergency-icon">🚑</div>
            <span>AMBULANCE</span>
          </button>
          <button className="emergency-btn puja-guide" onClick={handleExploreMap}>
            <div className="emergency-icon">🏛️</div>
            <span>PUJA GUIDE</span>
          </button>
          <button className="emergency-btn police" onClick={() => handleEmergencyCall('police')}>
            <div className="emergency-icon">📞</div>
            <span>POLICE HELP</span>
          </button>
          <button className="emergency-btn fire" onClick={() => handleEmergencyCall('fire')}>
            <div className="emergency-icon">🚒</div>
            <span>FIRE HELP</span>
          </button>
        </div>
        <button className="emergency-main-btn" onClick={handleEmergencyMain}>
          <span className="emergency-asterisk">*</span>
          <span>EMERGENCY</span>
        </button>
      </div>

      {/* Quick Access Section */}
      <div className="quick-access-section">
        <h3 className="quick-access-title">
          <span className="lightning-icon">⚡</span>
          QUICK ACCESS
        </h3>
        <div className="quick-access-grid">
          <button className="quick-access-btn" onClick={() => handleQuickAccess('police')}>
            <div className="quick-access-icon police">🛡️</div>
            <span>Police</span>
          </button>
          <button className="quick-access-btn" onClick={() => handleQuickAccess('hospital')}>
            <div className="quick-access-icon hospital">🏥</div>
            <span>Hospital</span>
          </button>
          <button className="quick-access-btn" onClick={() => handleQuickAccess('bus')}>
            <div className="quick-access-icon bus">🚌</div>
            <span>Bus Stands</span>
          </button>
          <button className="quick-access-btn" onClick={() => handleQuickAccess('metro')}>
            <div className="quick-access-icon metro">🚇</div>
            <span>Metro</span>
          </button>
        </div>
      </div>

      {/* Police Banner */}
      <div className="police-banner">
        <span>Baguiati Police wishes you Happy Durga Puja</span>
      </div>

      {/* Explore Nearby Section */}
      <div className="explore-nearby-section">
        <h3 className="explore-title">
          <span className="search-icon">🔍</span>
          Explore Nearby
        </h3>
        <div className="distance-filters">
          {['0.5 KM', '1 KM', '2 KM', '3 KM'].map((distance) => (
            <button
              key={distance}
              className={`distance-btn ${selectedDistance === distance ? 'active' : ''}`}
              onClick={() => handleDistanceFilter(distance)}
            >
              {distance}
            </button>
          ))}
        </div>
      </div>

      {/* Package Section */}
      <div className="packages-section">
        <div className="section-header">
        <h2 className="section-title">
            <span className="bengali-text">বাগুইআটি পূজা পরিক্রমা</span>
            <span className="english-text">Baguiati Puja Parikrama</span>
        </h2>
          <p className="section-subtitle">
            Experience the joy, devotion, and magnificence of Baguiati's Durga Puja with our guided parikrama
          </p>
        </div>
        <div className="packages-grid">
          <div className="package-card">
            <div className="package-image">
              <img 
                src="/images/durga-images/puja pandle 1.jpg" 
                alt="Interactive Map Tour"
                className="circular-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder circular-image" style={{ display: 'none' }}>
                <div className="placeholder-content">
                  <div className="placeholder-icon">🗺️</div>
                  <p>Interactive Map</p>
                </div>
              </div>
            </div>
            <div className="package-content">
              <h3 className="package-title">Interactive Map Tour</h3>
              <p className="package-description">Detailed map with 48 pandal locations and real-time navigation</p>
              <div className="package-features">
                <span className="feature-tag">GPS Navigation</span>
                <span className="feature-tag">Real-time Updates</span>
              </div>
              <div className="package-footer">
                <div className="package-price">Free</div>
                <button className="package-btn magnetic-btn" onClick={handleExploreMap}>Explore Now</button>
              </div>
            </div>
          </div>
          
          <div className="package-card">
            <div className="package-image">
              <img 
                src="/images/durga-images/puja pandle 2.jpg" 
                alt="Traffic & Parking Guide"
                className="circular-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder circular-image" style={{ display: 'none' }}>
                <div className="placeholder-content">
                  <div className="placeholder-icon">🚗</div>
                  <p>Traffic Guide</p>
                </div>
              </div>
            </div>
            <div className="package-content">
              <h3 className="package-title">Traffic & Parking Guide</h3>
              <p className="package-description">Real-time traffic flow and parking areas for hassle-free visits</p>
              <div className="package-features">
                <span className="feature-tag">Traffic Updates</span>
                <span className="feature-tag">Parking Info</span>
              </div>
              <div className="package-footer">
                <div className="package-price">Free</div>
                <button className="package-btn magnetic-btn" onClick={handleExploreMap}>View Guide</button>
              </div>
            </div>
          </div>
          
          <div className="package-card">
            <div className="package-image">
              <img 
                src="/images/durga-images/puja pandle 3.jpeg" 
                alt="Emergency Services"
                className="circular-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="image-placeholder circular-image" style={{ display: 'none' }}>
                <div className="placeholder-content">
                  <div className="placeholder-icon">📱</div>
                  <p>Emergency Services</p>
                </div>
              </div>
            </div>
            <div className="package-content">
              <h3 className="package-title">Emergency Services</h3>
              <p className="package-description">Quick access to police, ambulance, fire services and local amenities</p>
              <div className="package-features">
                <span className="feature-tag">24/7 Support</span>
                <span className="feature-tag">Quick Access</span>
              </div>
              <div className="package-footer">
                <div className="package-price">Free</div>
                <button className="package-btn magnetic-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>View Services</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pandal Gallery Section */}
      <div className="pandal-gallery-section">
        <div className="section-header">
        <h2 className="section-title">
            <span className="bengali-text">বাগুইআটি প্যান্ডেল গ্যালারি</span>
            <span className="english-text">Baguiati Pandal Gallery</span>
        </h2>
          <p className="section-subtitle">
            Discover the most beautiful and unique pandals in Baguiati with detailed information and features
          </p>
        </div>
        
        {searchQuery && (
          <div className="search-results-info">
            <span>Search results for "{searchQuery}": {filteredPandals.length} pandals found</span>
            <button className="clear-search-btn" onClick={() => {
              setSearchQuery('');
              setFilteredPandals(pujoLocations);
            }}>Clear Search</button>
          </div>
        )}
        {selectedDistance !== '1 KM' && !searchQuery && (
          <div className="distance-filter-info">
            <span>Showing pandals within {selectedDistance} of your location</span>
            <button className="clear-filter-btn" onClick={() => {
              setSelectedDistance('1 KM');
              setFilteredPandals(pujoLocations);
            }}>Show All</button>
          </div>
        )}
        
        <div className="pandal-gallery-grid">
          {filteredPandals.slice(0, 6).map((pujo, index) => (
            <div key={pujo.id} className="gallery-card" onClick={() => handlePandalClick(pujo.id)}>
              <div className="gallery-image">
                {pujo.imagePath ? (
                  <img 
                    src={pujo.imagePath} 
                    alt={pujo.name}
                    className="circular-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      e.target.nextElementSibling.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="image-placeholder circular-image" style={{ display: pujo.imagePath ? 'none' : 'flex' }}>
                  <div className="placeholder-content">
                    <div className="placeholder-icon">🏛️</div>
                    <p>Pandal #{pujo.id}</p>
                    <small>Add pandal image here</small>
                  </div>
                </div>
                <div className="gallery-overlay">
                  <div className="gallery-number">#{pujo.id}</div>
                </div>
              </div>
              <div className="gallery-content">
                <h3 className="gallery-title">{pujo.name}</h3>
                <p className="gallery-description">{pujo.description}</p>
                <div className="gallery-features">
                  {pujo.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="gallery-feature-tag">{feature}</span>
                  ))}
                </div>
                <div className="gallery-footer">
                  <button className="gallery-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-container">
          <button className="view-all-button" onClick={handleExploreMap}>
            <span className="bengali-text">সব প্যান্ডেল দেখুন</span>
            <span className="english-text">View All 48 Pandals</span>
          </button>
        </div>
      </div>


      {/* About Section */}
      <div className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">
              <span className="bengali-text">বাগুইআটি দুর্গা পূজা সম্পর্কে</span>
              <span className="english-text">About Baguiati Durga Puja</span>
            </h2>
            <div className="about-description">
            <p className="bengali-text">
              দুর্গা পূজা হল হিন্দু ধর্মের অন্যতম প্রধান উৎসব। এই উৎসবে মা দুর্গার পূজা করা হয়, 
              যিনি মহিষাসুর নামক অসুরকে বধ করেছিলেন। বাগুইআটিতে এই উৎসব বিশেষভাবে পালিত হয় এবং 
              বিভিন্ন প্যান্ডেলে সুন্দর সুন্দর মূর্তি ও সাজসজ্জা দেখা যায়।
            </p>
            <p className="english-text">
              Durga Puja is one of the most important festivals in Hinduism. This festival celebrates 
              Goddess Durga, who defeated the demon Mahishasura. In Baguiati, this festival is celebrated 
              with great enthusiasm and beautiful idols and decorations can be seen in various pandals.
            </p>
          </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="stat-number">48</div>
                <div className="stat-label">Pandals</div>
              </div>
              <div className="about-stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Visitors</div>
              </div>
              <div className="about-stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img 
              src="/images/durga-images/pandle pic.jpg" 
              alt="About Baguiati Durga Puja"
              className="circular-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="image-placeholder circular-image" style={{ display: 'none' }}>
              <div className="placeholder-content">
                <div className="placeholder-icon">🏛️</div>
                <p>About Image</p>
                <small>Add cultural image here</small>
              </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
