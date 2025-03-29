import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Patients Say</h2>
        <div className="testimonial-content">
          <div className="testimonial-card">
            <h3>Patient Workflow</h3>
            <p>We are working on our patients' workflows, including those who are working on their treatments.</p>
          </div>
          <div className="testimonial-card">
            <h3>Therapies & Workflow</h3>
            <p>To understand how they succeed you may be working on their workflows, we need to help them understand.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;