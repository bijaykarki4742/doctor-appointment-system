import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedDoctors from './components/FeaturedDoctors';
import FeaturesSection from './components/FeaturesSection';
import Testimonials from './components/Testimonials';
import MedicinesSection from './components/MedicinesSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <FeaturedDoctors />
      <FeaturesSection />
      <Testimonials />
      <MedicinesSection />
      <Footer />
    </div>
  );
}

export default App;