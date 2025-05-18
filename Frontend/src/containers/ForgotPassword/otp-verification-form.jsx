"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useOtpResend } from "@/components/hooks/use-otp-resend"

export default function OtpVerificationForm({ onSubmit, isLoading, error, email }) {
  const [otp, setOtp] = useState("")
  const { canResend, countdown, handleResend } = useOtpResend()

  const handleVerify = () => {
    if (otp.length === 6) {
      onSubmit(otp)
    }
  }

  return (
    <div className="space-y-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-2">
          We've sent a 6-digit verification code to {email}
        </p>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="text-sm text-muted-foreground mt-2">
          Didn't receive the code?{" "}
          {canResend ? (
            <Button variant="link" className="p-0 h-auto" onClick={handleResend}>
              Resend
            </Button>
          ) : (
            <span>Resend in {countdown}s</span>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleVerify} disabled={isLoading || otp.length !== 6}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Verify <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
