import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">MediBook</h1>
          <nav className="nav-links">
            <a href="#doctors">Doctors</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#medicines">Medicines</a>
          </nav>
          <button className="btn btn-primary">Book Appointment</button>
        </div>
      </div>
    </header>
  );
};

export default Header;