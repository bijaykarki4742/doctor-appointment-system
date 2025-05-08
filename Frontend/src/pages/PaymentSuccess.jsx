import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';
import Navbar from '@/containers/Navbar';
import { verifyEsewaPayment } from '@/services/esewaService';
import api from '@/api/axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Parse query parameters from the URL
        // According to latest eSewa docs, they return: ?transaction_uuid=&status=&total_amount=&signature=
        const params = new URLSearchParams(location.search);
        const transaction_uuid = params.get('transaction_uuid'); // Transaction UUID
        const status = params.get('status'); // Status (success/failure)
        const total_amount = params.get('total_amount'); // Total amount
        const signature = params.get('signature'); // Signature

        if (!transaction_uuid || !status || !total_amount) {
          throw new Error('Missing required parameters from eSewa');
        }

        // Verify the payment with eSewa
        const result = await verifyEsewaPayment({
          transaction_uuid,
          status,
          total_amount,
          signature
        });

        setVerificationResult(result);

        // Extract appointment ID from transaction UUID (if using our convention)
        let appointmentId = null;
        if (transaction_uuid.includes('APT-')) {
          appointmentId = transaction_uuid.split('APT-')[1].split('-')[0];
        }

        // Update appointment payment status in the backend
        if (appointmentId) {
          await api.patch(`/appointments/${appointmentId}/payment`, {
            paymentStatus: 'paid',
            paymentMethod: 'esewa',
            paymentAmount: amt,
            paymentDate: new Date().toISOString(),
            transactionId: refId
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationResult({
          success: false,
          message: error.message || 'Failed to verify payment'
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  const handleViewAppointments = () => {
    navigate('/dashboard');
  };

  const handleBookAnother = () => {
    navigate('/DoctorList');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>
              {isVerifying 
                ? 'Verifying your payment...' 
                : verificationResult?.success 
                  ? 'Your appointment has been confirmed.' 
                  : 'There was an issue verifying your payment.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerifying && verificationResult?.success && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Transaction Details</h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <p><span className="font-medium">Transaction UUID:</span> {new URLSearchParams(location.search).get('transaction_uuid') || 'N/A'}</p>
                    <p><span className="font-medium">Amount:</span> NPR {new URLSearchParams(location.search).get('total_amount') || '0'}</p>
                    <p><span className="font-medium">Status:</span> {new URLSearchParams(location.search).get('status') || 'N/A'}</p>
                    <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-medium">Payment Status:</span> <span className="text-green-600">Paid</span></p>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  <p>A confirmation email has been sent to your registered email address.</p>
                </div>
              </div>
            )}
            
            {!isVerifying && !verificationResult?.success && (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-700">
                  {verificationResult?.message || 'We received your payment, but there was an issue with verification. Please contact support if your appointment is not confirmed.'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={handleViewAppointments}
              className="w-full sm:w-auto"
            >
              View My Appointments
            </Button>
            <Button 
              onClick={handleBookAnother}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Another Appointment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccess;
