import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle feedback submission logic here (e.g., send to API)
        console.log({ feedback, rating });
        setSubmitted(true);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle>Send Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <p className="text-center text-green-600 font-medium">
                            Thank you for your feedback!
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="rating"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Rating (1-5):
                                </label>
                                <Input
                                    type="number"
                                    id="rating"
                                    min="1"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="feedback"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Feedback:
                                </label>
                                <Textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows="4"
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Submit
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Feedback;