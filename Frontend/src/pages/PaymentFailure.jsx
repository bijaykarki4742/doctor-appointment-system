import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import Navbar from '@/containers/Navbar';

const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error details from URL params
  // According to eSewa docs, they may return error details in the query params
  const params = new URLSearchParams(location.search);
  const errorMessage = params.get('q') || params.get('message') || 'Your payment could not be processed.';

  const handleTryAgain = () => {
    navigate(-1); // Go back to payment page
  };

  const handleGoHome = () => {
    navigate('/'); // Go to home page
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Payment Failed</CardTitle>
            <CardDescription>
              We couldn't process your payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Possible reasons for payment failure:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Insufficient funds in your eSewa account</li>
                  <li>Transaction timeout</li>
                  <li>Payment was cancelled</li>
                  <li>Technical issues with the payment gateway</li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Your appointment has not been confirmed. Please try again or contact support if you continue to experience issues.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="w-full sm:w-auto"
            >
              Go to Home
            </Button>
            <Button 
              onClick={handleTryAgain}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default PaymentFailure;
