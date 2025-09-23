import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pujoLocations } from '../data/pujoData';
import './PandalPage.css';

const PandalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pandal = pujoLocations.find(p => p.id === parseInt(id));

  if (!pandal) {
    return <div>Pandal not found</div>;
  }

  const handleGetDirections = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    // Get user's current location and open Google Maps with directions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const destinationLat = pandal.entryLat;
          const destinationLng = pandal.entryLng;
          
          // Open Google Maps with directions
          const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${destinationLat},${destinationLng}`;
          window.open(mapsUrl, '_blank');
        },
        (error) => {
          // Fallback: open Google Maps with just the destination
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${pandal.entryLat},${pandal.entryLng}`;
          window.open(mapsUrl, '_blank');
        }
      );
    } else {
      // Fallback: open Google Maps with just the destination
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${pandal.entryLat},${pandal.entryLng}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const handleCall = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    window.open(`tel:${pandal.phone || '+91 98765 43213'}`);
  };

  const handleShare = () => {
    if (window.playDurgaSound) {
      window.playDurgaSound('bell');
    }
    if (navigator.share) {
      navigator.share({
        title: pandal.name,
        text: `Visit ${pandal.name} for Durga Puja celebrations!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="pandal-page">
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

      {/* Header Section */}
      <div className="pandal-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="pandal-title">{pandal.name}</h1>
          <p className="pandal-motto bengali-motto">{pandal.motto || "Community Celebration"}</p>
          <p className="pandal-details">Established {pandal.established || "1970"} • <span className="bengali-theme">{pandal.theme || "Community Spirit"}</span></p>
          
          {/* Pandal Image */}
          {pandal.imagePath && (
            <div className="pandal-image-container">
              <img 
                src={pandal.imagePath} 
                alt={pandal.name}
                className="pandal-main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGetDirections}>
              <span className="btn-icon">✈</span>
              Get Directions
            </button>
            <button className="btn btn-secondary" onClick={handleCall}>
              <span className="btn-icon">📞</span>
              Call Now
            </button>
            <button className="btn btn-info" onClick={() => navigate(`/traffic-flow/${id}`)}>
              <span className="btn-icon">📍</span>
              Traffic Flow Map
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              <span className="btn-icon">🔗</span>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <div className="tab active">About</div>
        <div className="tab">Programs</div>
        <div className="tab">Volunteers</div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="content-cards">
          {/* About Card */}
          <div className="info-card">
            <h3 className="card-title">About the Committee</h3>
            <p className="card-description bengali-description">
              {pandal.bengaliDescription || pandal.description || "Fostering community bonds through grand celebrations and cultural programs that bring everyone together."}
            </p>
            
            {/* Cultural Significance */}
            {pandal.culturalSignificance && (
              <div className="cultural-significance">
                <h4 className="significance-title">Cultural Significance</h4>
                <p className="bengali-significance">{pandal.culturalSignificance}</p>
              </div>
            )}
            
            {/* Features */}
            {pandal.features && pandal.features.length > 0 && (
              <div className="features-section">
                <h4 className="features-title">Key Features</h4>
                <div className="features-grid">
                  {pandal.features.map((feature, index) => (
                    <span key={index} className="feature-tag bengali-features">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <span>Established: {pandal.established || "1970"}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">❤️</span>
                <span>Theme: <span className="bengali-theme">{pandal.theme || "Community Spirit"}</span></span>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Address: {pandal.address || `${pandal.name}, Baguiati - 700159`}</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="info-card">
            <h3 className="card-title">Contact Information</h3>
            
            {/* Committee Members */}
            <div className="committee-members">
              {pandal.contactPerson && (
                <div className="member-info">
                  <div className="contact-item">
                    <span className="contact-icon">👑</span>
                    <span>President</span>
                    <span className="member-name">{pandal.contactPerson}</span>
                  </div>
                  {pandal.contactPersonPhone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>President Phone</span>
                      <button className="contact-btn phone-btn" onClick={() => window.open(`tel:${pandal.contactPersonPhone}`)}>
                        {pandal.contactPersonPhone}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {pandal.secretary && (
                <div className="member-info">
                  <div className="contact-item">
                    <span className="contact-icon">📋</span>
                    <span>Secretary</span>
                    <span className="member-name">{pandal.secretary}</span>
                  </div>
                  {pandal.secretaryPhone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>Secretary Phone</span>
                      <button className="contact-btn phone-btn" onClick={() => window.open(`tel:${pandal.secretaryPhone}`)}>
                        {pandal.secretaryPhone}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {pandal.treasurer && (
                <div className="member-info">
                  <div className="contact-item">
                    <span className="contact-icon">💰</span>
                    <span>Treasurer</span>
                    <span className="member-name">{pandal.treasurer}</span>
                  </div>
                  {pandal.treasurerPhone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>Treasurer Phone</span>
                      <button className="contact-btn phone-btn" onClick={() => window.open(`tel:${pandal.treasurerPhone}`)}>
                        {pandal.treasurerPhone}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {pandal.jointSecretary && (
                <div className="member-info">
                  <div className="contact-item">
                    <span className="contact-icon">📝</span>
                    <span>Joint Secretary</span>
                    <span className="member-name">{pandal.jointSecretary}</span>
                  </div>
                  {pandal.jointSecretaryPhone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>Joint Secretary Phone</span>
                      <button className="contact-btn phone-btn" onClick={() => window.open(`tel:${pandal.jointSecretaryPhone}`)}>
                        {pandal.jointSecretaryPhone}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {pandal.viceSecretary && (
                <div className="member-info">
                  <div className="contact-item">
                    <span className="contact-icon">👥</span>
                    <span>Vice Secretary</span>
                    <span className="member-name">{pandal.viceSecretary}</span>
                  </div>
                  {pandal.viceSecretaryPhone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>Vice Secretary Phone</span>
                      <button className="contact-btn phone-btn" onClick={() => window.open(`tel:${pandal.viceSecretaryPhone}`)}>
                        {pandal.viceSecretaryPhone}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General Contact */}
            <div className="contact-items">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>Main Phone</span>
                <button className="contact-btn phone-btn" onClick={handleCall}>
                  {pandal.phone || '+91 98765 43213'}
                </button>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>WhatsApp</span>
                <button className="contact-btn whatsapp-btn" onClick={() => window.open(`https://wa.me/${pandal.phone?.replace(/\D/g, '') || '919876543213'}`)}>
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Special Programs Card */}
          {pandal.specialPrograms && pandal.specialPrograms.length > 0 && (
            <div className="info-card">
              <h3 className="card-title">Special Programs</h3>
              <div className="programs-grid">
                {pandal.specialPrograms.map((program, index) => (
                  <div key={index} className="program-item">
                    <span className="program-icon">🎭</span>
                    <span className="program-name bengali-programs">{program}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="geometric-pattern"></div>
      </div>

      {/* Back to Map Button */}
      <button className="back-to-map-btn" onClick={() => navigate('/map')}>
        <span className="btn-icon">📍</span>
        Back to Map
      </button>
    </div>
  );
};

export default PandalPage;
