import React from 'react';
import MedicineCard from './MedicineCard';
import './MedicinesSection.css';

const MedicinesSection = () => {
  const medicines = [
    {
      category: "Quick Labs",
      items: ["Food bottles", "Non-department food bottles", "Alerts lab"]
    },
    {
      category: "Cattises",
      items: [
        "1, 1 (550) 00-997",
        "0, 1 (550) 00-999",
        "0, 1 (550) 00-999",
        "0, 1 (550) 00-999",
        "0, 1 (550) 00-999"
      ]
    },
    {
      category: "Follow It",
      items: ["Follow It"]
    }
  ];

  return (
    <section className="medicines-section" id="medicines">
      <div className="container">
        <h2 className="section-title">Medicines</h2>
        <p className="section-subtitle">We use the following drugs: skin and blood glucose products:</p>
        <div className="medicines-grid">
          {medicines.map((medicine, index) => (
            <MedicineCard key={index} medicine={medicine} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicinesSection;