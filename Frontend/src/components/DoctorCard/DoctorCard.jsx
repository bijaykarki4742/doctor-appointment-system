import React from 'react';

const DoctorCard = ({ doctor }) => {
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i}>{i < doctor.rating ? '★' : '☆'}</span>
      );
    }
    return stars;
  };

  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p className="specialty">{doctor.specialty}</p>
      <p className="question">{doctor.question}</p>
      <div className="rating">
        <span className="stars">{renderStars()}</span>
      </div>
      <p className="review">{doctor.review}</p>
      <button className="btn btn-primary">Book Now</button>
    </div>
  );
};

export default DoctorCard;