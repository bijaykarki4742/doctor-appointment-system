import { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';

const ReviewList = ({ doctorId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      rating: 5,
      comment: 'Dr. Smith was very professional and took time to explain everything clearly. The wait time was minimal and the staff was friendly.',
      date: '2023-05-15',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      rating: 4,
      comment: 'Good experience overall. The doctor was knowledgeable but the wait time was longer than expected.',
      date: '2023-04-22',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  ]);
  
  const [averageRating, setAverageRating] = useState(4.5);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Patient Reviews</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <Star className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {showForm && (
        <ReviewForm 
          doctorId={doctorId} 
          onClose={() => setShowForm(false)} 
          onSubmit={(newReview) => {
            setReviews([newReview, ...reviews]);
            setShowForm(false);
          }} 
        />
      )}

      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center">
          <div className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-start">
        <img 
          src={review.avatar} 
          alt={review.patientName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{review.patientName}</h3>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
          <div className="flex my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;