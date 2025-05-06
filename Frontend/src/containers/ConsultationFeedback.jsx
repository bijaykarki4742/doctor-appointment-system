import { useState } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle, Smile, Frown, Meh } from 'lucide-react';

const ConsultationFeedback = ({ appointmentId, doctorName, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emojiOptions = [
    { icon: <Frown className="w-8 h-8" />, value: 'poor', label: 'Poor' },
    { icon: <Meh className="w-8 h-8" />, value: 'average', label: 'Average' },
    { icon: <Smile className="w-8 h-8" />, value: 'good', label: 'Good' },
    { icon: <Smile className="w-8 h-8" />, value: 'excellent', label: 'Excellent' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const feedbackData = {
        appointmentId,
        rating,
        comment,
        experienceRating: selectedEmoji,
        timestamp: new Date().toISOString()
      };
      
      onSubmit(feedbackData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Consultation Feedback</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          How was your consultation with <span className="font-medium">{doctorName}</span>?
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3">Overall Rating</label>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none mx-1"
                >
                  <Star
                    className={`w-8 h-8 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          {/* Experience Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-3">How was your experience?</label>
            <div className="flex justify-between">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji.value}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji.value)}
                  className={`flex flex-col items-center p-2 rounded-lg ${selectedEmoji === emoji.value ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <span className={`${selectedEmoji === emoji.value ? 'scale-110' : ''} transition-transform`}>
                    {emoji.icon}
                  </span>
                  <span className="text-xs mt-1">{emoji.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Comment Section */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Additional Comments (Optional)
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you like or what could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-blue-300"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationFeedback;