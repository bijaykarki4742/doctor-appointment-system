import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Medicines v.14 (cpt) managed.</p>
      </div>
    </footer>
  );
};

export default Footer;