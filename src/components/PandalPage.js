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
      {/* Header Section */}
      <div className="pandal-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="pandal-title">{pandal.name}</h1>
          <p className="pandal-motto">Brotherhood in Celebration</p>
          <p className="pandal-details">Established 1968 • Community Harmony</p>
          
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGetDirections}>
              <span className="btn-icon">✈</span>
              Get Directions
            </button>
            <button className="btn btn-secondary" onClick={handleCall}>
              <span className="btn-icon">📞</span>
              Call Now
            </button>
            <button className="btn btn-info" onClick={() => navigate(`/pandal/${id}`)}>
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
            <p className="card-description">
              {pandal.description || "Fostering community bonds through grand celebrations and cultural programs that bring everyone together."}
            </p>
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <span>Established: 1968</span>
              </div>
              <div className="info-item">
                <span className="info-icon">❤️</span>
                <span>Theme: Community Harmony</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Address: {pandal.name}, Kolkata - 700159</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="info-card">
            <h3 className="card-title">Contact Information</h3>
            <div className="contact-items">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>Phone</span>
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
        </div>
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
