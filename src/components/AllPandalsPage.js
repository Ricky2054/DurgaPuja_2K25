import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pujoLocations } from '../data/pujoData';
import InteractiveEffects from './InteractiveEffects';
import './AllPandalsPage.css';

const AllPandalsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPandals, setFilteredPandals] = useState(pujoLocations);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    let filtered = pujoLocations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pandal => 
        (pandal.name && pandal.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pandal.address && pandal.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pandal.bengaliDescription && pandal.bengaliDescription.includes(searchQuery)) ||
        (pandal.description && pandal.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort filter
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'established':
        filtered.sort((a, b) => (b.established || '').localeCompare(a.established || ''));
        break;
      case 'theme':
        filtered.sort((a, b) => (a.theme || '').localeCompare(b.theme || ''));
        break;
      default:
        break;
    }

    setFilteredPandals(filtered);
  }, [searchQuery, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="all-pandals-page">
      <InteractiveEffects />
      
      {/* Header Section */}
      <div className="all-pandals-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="bengali-text">বাগুইআটি প্যান্ডেল গ্যালারি</span>
            <span className="english-text">Baguiati Pandal Gallery</span>
          </h1>
          <p className="page-subtitle">
            <span className="bengali-text">সমস্ত ৪৮টি প্যান্ডেলের বিস্তারিত তথ্য</span>
            <span className="english-text">Complete information of all 48 pandals</span>
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search pandals..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-btn">
            <span>🔍</span>
          </button>
        </div>
        
        <div className="filter-container">
          <select value={sortBy} onChange={handleSortChange} className="sort-select">
            <option value="name">Sort by Name</option>
            <option value="established">Sort by Established Year</option>
            <option value="theme">Sort by Theme</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p className="bengali-text">মোট {filteredPandals.length}টি প্যান্ডেল পাওয়া গেছে</p>
        <p className="english-text">Found {filteredPandals.length} pandals</p>
      </div>

      {/* Pandals Grid */}
      <div className="all-pandals-grid">
        {filteredPandals.map((pandal) => (
          <div key={pandal.id} className="pandal-card">
            <div className="card-image-container">
              {pandal.imagePath ? (
                <img 
                  src={pandal.imagePath} 
                  alt={pandal.name || 'Pandal Image'}
                  className="pandal-card-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                  onLoad={(e) => {
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) {
                      placeholder.style.display = 'none';
                    }
                  }}
                />
              ) : null}
              <div className="image-placeholder" style={{ display: pandal.imagePath ? 'none' : 'flex' }}>
                <div className="placeholder-content">
                  <div className="placeholder-icon">🏛️</div>
                  <p>Pandal #{pandal.id}</p>
                </div>
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{pandal.name || 'Pandal Name'}</h3>
              
              {(pandal.bengaliDescription || pandal.description) && (
                <p className="card-description bengali-description">
                  {(() => {
                    const desc = pandal.bengaliDescription || pandal.description || '';
                    return desc.length > 150 ? `${desc.substring(0, 150)}...` : desc;
                  })()}
                </p>
              )}

              <div className="card-features">
                {pandal.features && Array.isArray(pandal.features) && pandal.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="feature-tag bengali-features">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="card-info">
                {pandal.established && (
                  <div className="info-item">
                    <span className="info-label">Established:</span>
                    <span className="info-value">{pandal.established}</span>
                  </div>
                )}
                {pandal.theme && (
                  <div className="info-item">
                    <span className="info-label">Theme:</span>
                    <span className="info-value bengali-theme">{pandal.theme}</span>
                  </div>
                )}
              </div>

              <Link to={`/pandal-page/${pandal.id}`} className="view-details-btn">
                <span className="bengali-text">বিস্তারিত দেখুন</span>
                <span className="english-text">View Details</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Back to Home Button */}
      <div className="back-to-home">
        <Link to="/" className="back-btn">
          <span className="bengali-text">← হোমে ফিরুন</span>
          <span className="english-text">← Back to Home</span>
        </Link>
      </div>
    </div>
  );
};


export default AllPandalsPage;
