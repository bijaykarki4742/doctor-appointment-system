import React from 'react';
import DoctorCard from './DoctorCard';
import './FeaturedDoctors.css';

const FeaturedDoctors = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      rating: 4,
      review: "You're not a good person",
      question: "Question #3"
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      specialty: "Dermatologist",
      rating: 4,
      review: "You should have a good friend",
      question: "Question #2"
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4,
      review: "You should have a good friend",
      question: "Question #3"
    },
    {
      id: 4,
      name: "Dr. Emily Brown",
      specialty: "Pediatrician",
      rating: 4,
      review: "You should have a good friend",
      question: "Question #5"
    }
  ];

  return (
    <section className="featured-doctors" id="doctors">
      <div className="container">
        <h2 className="section-title">Our Featured Doctors</h2>
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;