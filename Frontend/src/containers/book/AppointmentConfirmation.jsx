import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Check, Calendar, Clock, User, Mail, Phone, FileText, CreditCard, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axios"

// Mock eSewa UI components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AppointmentConfirmation({ doctor, date, time, patientInfo, onBookAnother, appointmentId }) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentError, setPaymentError] = useState(null);
  const [showMockEsewa, setShowMockEsewa] = useState(false);
  const [mockStep, setMockStep] = useState(1);
  const [mockCredentials, setMockCredentials] = useState({ id: '', password: '', token: '' });
  const navigate = useNavigate();

  // Calculate consultation fee based on doctor's specialty or use a default value
  const consultationFee = doctor.consultationFee || 500;

  useEffect(() => {
    // Log that the component has mounted with the appointment ID
    console.log("AppointmentConfirmation mounted with appointmentId:", appointmentId);
  }, [appointmentId]);

  // Handle redirecting to the actual eSewa website
  const handlePayNow = () => {
    try {
      setIsPaymentProcessing(true);
      setPaymentError(null);
      
      // Create a unique transaction ID for this payment
      const transactionId = 'APT-' + (appointmentId || Date.now()) + '-' + Math.floor(Math.random() * 1000000);
      
      // Direct URL to eSewa login page
      window.open('https://esewa.com.np/login', '_blank');
      
      // Reset processing state
      setIsPaymentProcessing(false);
      
      // For demo purposes, show an alert with instructions
      alert('You will be redirected to the eSewa login page. For testing, use:\n\neSewa ID: 9806800001\nPassword: Nepal@123\nToken: 123456');
    } catch (error) {
      console.error('Error redirecting to eSewa:', error);
      setIsPaymentProcessing(false);
      setPaymentError('Failed to redirect to eSewa. Please try again.');
    }
  };
  
  // Handle mock eSewa login
  const handleMockLogin = () => {
    // Validate credentials
    if (!mockCredentials.id || !mockCredentials.password) {
      alert('Please enter your eSewa ID and password');
      return;
    }
    
    // Move to 2FA step
    setMockStep(2);
  };
  
  // Handle mock 2FA verification
  const handleMockVerify = () => {
    // Validate token
    if (!mockCredentials.token) {
      alert('Please enter your token');
      return;
    }
    
    // Move to payment confirmation step
    setMockStep(3);
  };
  
  // Handle mock payment confirmation
  const handleMockConfirm = async () => {
    try {
      // Close the dialog
      setShowMockEsewa(false);
      setMockStep(1);
      
      // Update payment status
      setPaymentStatus('paid');
      
      // Update appointment payment status in the database
      if (appointmentId) {
        await api.patch(`/appointments/${appointmentId}/payment`, {
          paymentStatus: 'paid',
          paymentMethod: 'esewa',
          paymentAmount: consultationFee,
          paymentDate: new Date().toISOString(),
          transactionId: `MOCK-${Date.now()}`
        });
      }
      
      // Show success message
      alert('Payment successful! Your appointment has been confirmed.');
      
    } catch (error) {
      console.error('Payment update error:', error);
      setPaymentError('Failed to update payment status. Please contact support.');
    }
  };
  
  // Handle canceling the mock payment
  const handleMockCancel = () => {
    setShowMockEsewa(false);
    setMockStep(1);
  };

  return (
    <>
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
          <CardDescription>Your appointment has been successfully scheduled</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Appointment Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Doctor: {doctor.name} ({doctor.specialty})
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Date: {format(date, "PPPP")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Time: {time}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Consultation Fee: NPR {consultationFee}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Patient Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Name: {patientInfo.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email: {patientInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Phone: {patientInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Reason: {patientInfo.reason}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Payment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please complete your payment to confirm your appointment.
            </p>
            {paymentError && (
              <div className="bg-red-50 p-3 rounded-md mb-3">
                <p className="text-sm text-red-600">{paymentError}</p>
              </div>
            )}
            
            {/* Real eSewa Payment Button */}
            <div className="mb-4">
              <Button 
                onClick={handlePayNow}
                disabled={isPaymentProcessing || paymentStatus === 'paid'}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                {isPaymentProcessing ? 'Processing...' : paymentStatus === 'paid' ? 'Payment Completed' : 'Pay with eSewa'}
              </Button>
            </div>
            
            {/* Alternative direct link to eSewa */}
            <div className="mb-4">
              <a 
                href="https://esewa.com.np/login" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Open eSewa login directly in new tab
              </a>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <h4 className="font-medium text-blue-700 mb-1">eSewa Test Credentials</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li><span className="font-medium">eSewa ID:</span> 9806800001</li>
                <li><span className="font-medium">Password:</span> Nepal@123</li>
                <li><span className="font-medium">Token:</span> 123456</li>
              </ul>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Secure payment via eSewa. You will be redirected to eSewa's payment page.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address. Please arrive 15 minutes before your appointment
              time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>View My Appointments</Button>
        <Button onClick={onBookAnother}>Book Another Appointment</Button>
      </CardFooter>
      </Card>

      {/* Mock eSewa Payment Dialog */}
      <Dialog open={showMockEsewa} onOpenChange={setShowMockEsewa}>
      <DialogContent className="sm:max-w-md">
        {/* Step 1: Login */}
        {mockStep === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center">
                <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa Logo" className="h-10" />
              </DialogTitle>
              <DialogDescription className="text-center">
                Enter your eSewa credentials
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">eSewa ID</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="9806800001"
                  value={mockCredentials.id}
                  onChange={(e) => setMockCredentials({...mockCredentials, id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nepal@123"
                  value={mockCredentials.password}
                  onChange={(e) => setMockCredentials({...mockCredentials, password: e.target.value})}
                />
              </div>
              <div className="text-xs text-blue-600">
                <p>For testing, use:</p>
                <p>ID: 9806800001</p>
                <p>Password: Nepal@123</p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleMockLogin}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                Login
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: 2FA */}
        {mockStep === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center">
                <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa Logo" className="h-10" />
              </DialogTitle>
              <DialogDescription className="text-center">
                Two-Factor Authentication
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Token</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="123456"
                  value={mockCredentials.token}
                  onChange={(e) => setMockCredentials({...mockCredentials, token: e.target.value})}
                />
              </div>
              <div className="text-xs text-blue-600">
                <p>For testing, use token: 123456</p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleMockVerify}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                Verify
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Payment Confirmation */}
        {mockStep === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center">
                <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa Logo" className="h-10" />
              </DialogTitle>
              <DialogDescription className="text-center">
                Payment Confirmation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Merchant:</span> Doctor Appointment System</p>
                  <p><span className="font-medium">Amount:</span> NPR {consultationFee}</p>
                  <p><span className="font-medium">Transaction ID:</span> {`MOCK-${Date.now()}`}</p>
                  <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleMockCancel}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMockConfirm}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Payment
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
