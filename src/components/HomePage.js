import React from 'react';
import { useNavigate } from 'react-router-dom';
import { pujoLocations } from '../data/pujoData';

const HomePage = () => {
  const navigate = useNavigate();

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

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="bengali-text">শুভ দুর্গা পূজা</span>
            <br />
            <span className="english-text">Happy Durga Puja</span>
          </h1>
          <p className="hero-subtitle">
            <span className="bengali-text">কলকাতার সবচেয়ে সুন্দর প্যান্ডেলগুলি আবিষ্কার করুন</span>
            <br />
            <span className="english-text">Discover the most beautiful pandals of Kolkata</span>
          </p>
          <button className="explore-button" onClick={handleExploreMap}>
            <span className="bengali-text">মানচিত্র অন্বেষণ করুন</span>
            <br />
            <span className="english-text">Explore Map</span>
          </button>
        </div>
        <div className="hero-image">
          <img src="/thakur.png" alt="Durga Puja" className="thakur-hero-image" />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">
          <span className="bengali-text">বিশেষ বৈশিষ্ট্য</span>
          <span className="english-text">Special Features</span>
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3 className="bengali-text">ইন্টারেক্টিভ মানচিত্র</h3>
            <h3 className="english-text">Interactive Map</h3>
            <p className="bengali-text">৮টি প্যান্ডেলের অবস্থান সহ বিস্তারিত মানচিত্র</p>
            <p className="english-text">Detailed map with 8 pandal locations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3 className="bengali-text">ট্র্যাফিক অ্যানিমেশন</h3>
            <h3 className="english-text">Traffic Animation</h3>
            <p className="bengali-text">রিয়েল-টাইম ট্র্যাফিক ফ্লো এবং পার্কিং এরিয়া</p>
            <p className="english-text">Real-time traffic flow and parking areas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h3 className="bengali-text">প্যান্ডেল তথ্য</h3>
            <h3 className="english-text">Pandal Information</h3>
            <p className="bengali-text">প্রতিটি প্যান্ডেলের বিস্তারিত তথ্য এবং বৈশিষ্ট্য</p>
            <p className="english-text">Detailed information and features of each pandal</p>
          </div>
        </div>
      </div>

      {/* Pandal Preview Section */}
      <div className="pandal-preview-section">
        <h2 className="section-title">
          <span className="bengali-text">প্যান্ডেল গ্যালারি</span>
          <span className="english-text">Pandal Gallery</span>
        </h2>
        <div className="pandal-grid">
          {pujoLocations.slice(0, 6).map((pujo, index) => (
            <div key={pujo.id} className="pandal-card" onClick={() => handlePandalClick(pujo.id)}>
              <div className="pandal-number">{index + 1}</div>
              <div className="pandal-info">
                <h3 className="pandal-name bengali-text">{pujo.name}</h3>
                <p className="pandal-description english-text">{pujo.description}</p>
                <div className="pandal-features">
                  {pujo.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <button className="view-all-button" onClick={handleExploreMap}>
            <span className="bengali-text">সব প্যান্ডেল দেখুন</span>
            <span className="english-text">View All Pandals</span>
          </button>
        </div>
      </div>

      {/* Cultural Information */}
      <div className="cultural-section">
        <div className="cultural-content">
          <h2 className="section-title">
            <span className="bengali-text">দুর্গা পূজার ইতিহাস</span>
            <span className="english-text">History of Durga Puja</span>
          </h2>
          <div className="cultural-text">
            <p className="bengali-text">
              দুর্গা পূজা হল হিন্দু ধর্মের অন্যতম প্রধান উৎসব। এই উৎসবে মা দুর্গার পূজা করা হয়, 
              যিনি মহিষাসুর নামক অসুরকে বধ করেছিলেন। কলকাতায় এই উৎসব বিশেষভাবে পালিত হয় এবং 
              বিভিন্ন প্যান্ডেলে সুন্দর সুন্দর মূর্তি ও সাজসজ্জা দেখা যায়।
            </p>
            <p className="english-text">
              Durga Puja is one of the most important festivals in Hinduism. This festival celebrates 
              Goddess Durga, who defeated the demon Mahishasura. In Kolkata, this festival is celebrated 
              with great enthusiasm and beautiful idols and decorations can be seen in various pandals.
            </p>
          </div>
        </div>
        <div className="cultural-image">
          <img src="/thakur.png" alt="Durga Puja Culture" className="cultural-thakur-image" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
