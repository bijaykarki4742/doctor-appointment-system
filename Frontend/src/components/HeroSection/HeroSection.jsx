import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Book Your Doctor's Appointment Online</h1>
          <p>Find out local appointments with the best doctors near your location.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Book Appointment</button>
            <button className="btn btn-outline">Free Inquiry</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;