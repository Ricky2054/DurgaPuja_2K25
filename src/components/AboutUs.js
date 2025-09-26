import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1 className="about-us-title">
          <span className="bengali-text">আমাদের সম্পর্কে</span>
          <span className="english-text">About Us</span>
        </h1>
        <p className="about-us-subtitle">
          <span className="bengali-text">বাগুইআটি দুর্গা পূজা পরিক্রমা ওয়েবসাইটের পিছনের দল</span>
          <span className="english-text">The team behind Baguiati Durga Puja Parikrama website</span>
        </p>
      </div>

      <div className="about-us-content">
        {/* Police Station Section */}
        <div className="police-station-section">
          <div className="police-badge">
            <div className="badge-icon">
              <img 
                src="/police_logo.jpeg?v=1" 
                alt="Baguiati Police Station Logo"
                className="police-logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="fallback-icon" style={{ display: 'none' }}>🛡️</div>
            </div>
            <h2 className="police-title">Baguiati Police Station</h2>
          </div>
          <p className="police-description">
            <span className="bengali-text">
              এই ওয়েবসাইটটি সম্পূর্ণভাবে বাগুইআটি পুলিশ স্টেশন দ্বারা পরিচালিত। 
              দুর্গা পূজার সময় জনগণের সুবিধার জন্য এই ডিজিটাল প্ল্যাটফর্ম তৈরি করা হয়েছে।
            </span>
            <span className="english-text">
              This website is completely conducted by Baguiati Police Station. 
              This digital platform has been created for the convenience of the public during Durga Puja.
            </span>
          </p>
          <div className="police-contact">
            <div className="contact-item">
              <span className="contact-label">Mobile:</span>
              <span className="contact-value">+91 91478 89500</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Landline:</span>
              <span className="contact-value">033 2559 8799</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <span className="contact-value">Baguiati, Kolkata</span>
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div className="developers-section">
          <h2 className="developers-title">
            <span className="bengali-text">ডেভেলপার দল</span>
            <span className="english-text">Development Team</span>
          </h2>
          
          <div className="developers-grid">
            {/* Ricky Dey */}
            <div className="developer-card">
              <div className="developer-photo">
                <img 
                  src="/my_pic.png?v=1" 
                  alt="Ricky Dey"
                  className="developer-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="photo-placeholder" style={{ display: 'none' }}>
                  <div className="placeholder-icon">👨‍💻</div>
                  <p>Ricky Dey</p>
                  <small>Photo Placeholder</small>
                </div>
              </div>
              <div className="developer-info">
                <h3 className="developer-name">Ricky Dey</h3>
                <p className="developer-role">
                  <span className="bengali-text">সি.এস.ই বিভাগের চূড়ান্ত বর্ষের ছাত্র</span>
                  <span className="english-text">Final Year Student, CSE Department</span>
                </p>
                <p className="developer-institution">
                  <span className="bengali-text">টেকনো ইন্টারন্যাশনাল নিউ টাউন</span>
                  <span className="english-text">Techno International New Town</span>
                </p>
              </div>
            </div>

            {/* Sorbojit Mondal */}
            <div className="developer-card">
              <div className="developer-photo">
                <img 
                  src="/sonu_photo.jpeg?v=1" 
                  alt="Sorbojit Mondal"
                  className="developer-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="photo-placeholder" style={{ display: 'none' }}>
                  <div className="placeholder-icon">👨‍💻</div>
                  <p>Sorbojit Mondal</p>
                  <small>Photo Placeholder</small>
                </div>
              </div>
              <div className="developer-info">
                <h3 className="developer-name">Sorbojit Mondal</h3>
                <p className="developer-role">
                  <span className="bengali-text">সি.এস.ই বিভাগের চূড়ান্ত বর্ষের ছাত্র</span>
                  <span className="english-text">Final Year Student, CSE Department</span>
                </p>
                <p className="developer-institution">
                  <span className="bengali-text">টেকনো ইন্টারন্যাশনাল নিউ টাউন</span>
                  <span className="english-text">Techno International New Town</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info Section */}
        <div className="project-info-section">
          <h2 className="project-title">
            <span className="bengali-text">প্রকল্প সম্পর্কে</span>
            <span className="english-text">About the Project</span>
          </h2>
          <div className="project-description">
            <p className="bengali-text">
              বাগুইআটি দুর্গা পূজা পরিক্রমা ওয়েবসাইটটি দুর্গা পূজার সময় স্থানীয় এবং দূরবর্তী দর্শকদের 
              জন্য একটি সম্পূর্ণ গাইড প্রদান করে। এই ওয়েবসাইটে ৪৮টি প্যান্ডেলের বিস্তারিত তথ্য, 
              ইন্টারঅ্যাক্টিভ ম্যাপ, ট্র্যাফিক গাইড এবং জরুরি পরিষেবার তথ্য রয়েছে।
            </p>
            <p className="english-text">
              The Baguiati Durga Puja Parikrama website provides a complete guide for local and 
              remote visitors during Durga Puja. This website contains detailed information about 
              48 pandals, interactive map, traffic guide, and emergency services information.
            </p>
          </div>
          
          <div className="project-features">
            <div className="feature-item">
              <div className="feature-icon">🗺️</div>
              <div className="feature-text">
                <h4>Interactive Map</h4>
                <p>Real-time navigation to all pandals</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚗</div>
              <div className="feature-text">
                <h4>Traffic Guide</h4>
                <p>Live traffic updates and parking info</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div className="feature-text">
                <h4>Emergency Services</h4>
                <p>Quick access to police and medical help</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏛️</div>
              <div className="feature-text">
                <h4>Pandal Information</h4>
                <p>Detailed info about all 48 pandals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="back-to-home">
          <Link to="/" className="back-home-btn">
            <span className="bengali-text">হোমে ফিরুন</span>
            <span className="english-text">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
