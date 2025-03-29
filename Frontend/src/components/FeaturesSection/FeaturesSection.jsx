import React from 'react';
import FeatureCard from './FeatureCard';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      title: "Easy Scheduling",
      description: "Book your appointments online with our simple scheduling system."
    },
    {
      title: "Qualified Doctors",
      description: "Access to highly qualified and experienced medical professionals."
    },
    {
      title: "24/7 Support",
      description: "Customer support available round the clock for all your queries."
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;