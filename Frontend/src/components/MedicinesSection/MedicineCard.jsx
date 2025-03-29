import React from 'react';

const MedicineCard = ({ medicine }) => {
  return (
    <div className="medicine-card">
      <h3>{medicine.category}</h3>
      <ul>
        {medicine.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineCard;