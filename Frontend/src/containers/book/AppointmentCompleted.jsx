// import { useState } from 'react';
// import ConsultationFeedback from '../ConsultationFeedback';

// const AppointmentCompleted = ({ appointment }) => {
//   const [showFeedback, setShowFeedback] = useState(false);

//   const handleSubmitFeedback = async (feedbackData) => {
//     // Here you would typically send the data to your backend
//     console.log('Feedback submitted:', feedbackData);
//     // Example API call:
//     // await fetch('/api/feedback', {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify(feedbackData)
//     // });
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-4">Consultation Completed</h2>
//       <p className="text-gray-600 mb-6">
//         Thank you for your consultation with Dr. {appointment.doctorName}.
//         Please share your feedback to help us improve our service.
//       </p>
      
//       <button
//         onClick={() => setShowFeedback(true)}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
//       >
//         Provide Feedback
//       </button>
      
//       {showFeedback && (
//         <ConsultationFeedback
//           appointmentId={appointment._id}
//           doctorName={appointment.doctorName}
//           onClose={() => setShowFeedback(false)}
//           onSubmit={handleSubmitFeedback}
//         />
//       )}
//     </div>
//   );
// };

// export default AppointmentCompleted;