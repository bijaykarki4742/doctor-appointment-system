import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { useState } from "react"

export function PaymentStep({
    doctor,
    date,
    timeSlot,
    patientInfo,
    onPaymentSuccess,
    onBack
}) {
    const [isProcessing, setIsProcessing] = useState(false)

    const initiateEsewaPayment = () => {
        setIsProcessing(true)

        // For demo purposes, we'll simulate a successful payment
        setTimeout(() => {
            setIsProcessing(false)
            toast.success("Payment successful!")
            onPaymentSuccess()
        }, 2000)
    }

    return (
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-500 text-white p-4">
                <CardTitle className="text-2xl font-bold">Payment</CardTitle>
                <CardDescription className="text-white">
                    Complete payment to confirm your appointment
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Appointment Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Doctor</p>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">
                                {new Date(date).toLocaleDateString()} • {timeSlot.start} - {timeSlot.end}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Patient</p>
                            <p className="font-medium">{patientInfo.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Reason</p>
                            <p className="font-medium">{patientInfo.reason}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-4">Payment Method</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <img
                                src="esewa-icon.png"
                                alt="eSewa"
                                className="h-10"
                            />
                            <div>
                                <p className="font-medium">eSewa</p>
                                <p className="text-sm text-gray-500">Pay via eSewa wallet</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">Total Amount</p>
                        <p className="text-xl font-bold">NPR 1000</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isProcessing}
                >
                    Back
                </Button>
                <Button
                    onClick={initiateEsewaPayment}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isProcessing ? "Processing..." : "Pay with eSewa"}
                </Button>
            </CardFooter>
        </Card>
    )
}