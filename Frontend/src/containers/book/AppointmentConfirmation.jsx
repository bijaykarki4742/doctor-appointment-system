import api from "@/api/axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Check, Calendar, Clock, User, Mail, Phone, FileText, Home, Star } from "lucide-react"
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom";

export function AppointmentConfirmation({ doctor, date, time, patientInfo, onBookAnother, appointmentId }) {
  const [isSending, setIsSending] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [error, setError] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const to = useNavigate();

  const sendNotifications = async () => {
    setIsSending(true);
    setError(null);

    try {
      const response = await api.post('/sendNotification', {
        appointmentDetails: {
          doctor,
          date: format(date, "PPPP"),
          time,
        },
        patientInfo
      });

      setNotificationSent(true);
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.error || err.message || 'Failed to send notifications');
    } finally {
      setIsSending(false);
    }
  };

  const submitReview = async () => {
    if (!review || rating === 0) {
      setError("Please provide both a rating and review");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await api.post('/review', {
        appointmentId,
        rating,
        comment: review
      });
      setReviewSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    sendNotifications();
  }, []);

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        <CardDescription>Your appointment has been successfully scheduled</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-bold ">Appointment Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">
                  Doctor: {doctor.name} ({doctor.specialty})
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Date: {format(date, "PPPP")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Time: {time}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Patient Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Name: {patientInfo.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Email: {patientInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Phone: {patientInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-base">Reason: {patientInfo.reason}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">What's Next?</h3>
            <p className="text-base text-muted-foreground">
              A confirmation email has been sent to your email address. Please arrive 15 minutes before your appointment
              time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <div className="flex space-x-3 ">
          <Button
            variant="outline"
            onClick={() => to('/')}
            className="flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
          <Button onClick={onBookAnother}>
            Book Another Appointment
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Leave a Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate Your Consultation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="flex mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with this doctor..."
                    className="mt-2"
                  />
                </div>
                {error && <div className="text-red-500 text-base">{error}</div>}
                {reviewSubmitted ? (
                  <div className="text-green-500 text-base">Thank you for your review!</div>
                ) : (
                  <Button
                    onClick={submitReview}
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}