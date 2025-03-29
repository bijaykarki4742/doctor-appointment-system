import React, { useState } from 'react';
import DoctorCard from './DoctorCard';
import './DoctorsSection.css';

const DoctorsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All Specialties');
  
  const filters = [
    'All Specialties',
    'Cardiologist',
    'Dentist',
    'Dermatologist',
    'Neurologist'
  ];

  const sortOptions = [
    'Sort by: Rating',
    'Sort by: Experience',
    'Sort by: Distance'
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 5,
      reviews: 124,
      location: 'Kathmandu Medical Center, 2.5km away',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Sharma',
      specialty: 'Neurologist',
      rating: 4,
      reviews: 89,
      location: 'Neuro Care Hospital, 3.1km away',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      name: 'Dr. Priya Patel',
      specialty: 'Dermatologist',
      rating: 5,
      reviews: 156,
      location: 'Skin Care Clinic, 1.8km away',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      name: 'Dr. Michael Chen',
      specialty: 'Dentist',
      rating: 4,
      reviews: 72,
      location: 'Dental Care Center, 4.2km away',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <section className="doctors-section">
      <div className="container">
        <h2 className="section-title">Top Doctors Near You</h2>
        
        <div className="filter-bar">
          <div className="filter-options">
            {filters.map(filter => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div>
            <select className="sort-select">
              {sortOptions.map(option => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="doctors-grid">
          {doctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;