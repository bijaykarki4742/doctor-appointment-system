import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { initiateEsewaPayment } from '@/services/esewaService';
import Navbar from '@/containers/Navbar';
import { useAuth } from '@/Contexts/AuthContext';
import api from '@/api/axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get appointment details from location state or fetch from API
  const { appointment } = location.state || {};
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // If no appointment data is passed, redirect back to appointments
    if (!appointment) {
      navigate('/dashboard');
      return;
    }

    // Calculate payment amount based on doctor's consultation fee
    // For UAT, we'll use a fixed amount if not provided
    const amount = appointment.consultationFee || 500;
    
    setPaymentDetails({
      amount,
      productId: `APT-${appointment.id || Date.now()}`, // Use appointment ID or timestamp as product ID
      productName: `Doctor Appointment - ${appointment.doctorName || 'Consultation'}`,
      appointmentId: appointment.id,
    });
  }, [appointment, isAuthenticated, navigate, location]);

  const handlePayNow = () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!paymentDetails) {
        throw new Error('Payment details not available');
      }

      // Get eSewa payment parameters
      const esewaPayment = initiateEsewaPayment(paymentDetails);
      
      // Create a form element to submit to eSewa - Following official documentation
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', esewaPayment.url);
      
      // Add parameters as hidden fields
      Object.entries(esewaPayment.params).forEach(([key, value]) => {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', value);
        form.appendChild(hiddenField);
      });

      // Add form to body, submit it
      document.body.appendChild(form);
      form.submit();
      
      // Note: We don't remove the form here as it's being submitted to a different domain
      // The browser will handle the redirection to eSewa's payment page
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      setIsLoading(false);
      console.error('Payment initiation error:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!paymentDetails) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Loading Payment Details</CardTitle>
              <CardDescription>Please wait...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              Secure payment via eSewa for your doctor appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">Appointment Details</h3>
                <div className="mt-2 text-sm text-gray-700">
                  <p><span className="font-medium">Doctor:</span> {appointment.doctorName || 'Doctor Consultation'}</p>
                  <p><span className="font-medium">Date:</span> {appointment.date || 'Scheduled Date'}</p>
                  <p><span className="font-medium">Time:</span> {appointment.time || 'Scheduled Time'}</p>
                  <p><span className="font-medium">Service:</span> {appointment.reason || 'Medical Consultation'}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Consultation Fee</p>
                  <p>NPR {paymentDetails.amount}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Payment will be processed securely via eSewa
                </p>
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayNow}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Processing...' : 'Pay with eSewa'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Payment;
