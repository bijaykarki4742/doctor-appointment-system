"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForgotPassword } from "@/containers/ForgotPassword/use-forgot-password"
import ForgotPasswordForm from "@/containers/ForgotPassword/forgot-password-form"
import OtpVerificationForm from "@/containers/ForgotPassword/otp-verification-form"
import ResetPasswordForm from "@/containers/ForgotPassword/reset-password-form"
import SuccessMessage from "@/containers/ForgotPassword/success-message"

export default function ForgotPasswordDialog({ open, onOpenChange }) {
  const { step, email, setEmail, handleSendOtp, handleVerifyOtp, handleResetPassword, isLoading, error, resetFlow } =
    useForgotPassword({
      onComplete: () => {
        // Close dialog after successful password reset
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
      },
    })

  // Reset flow when dialog is closed
  const handleOpenChange = (open) => {
    if (!open) {
      resetFlow()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
            {step === 4 && "Success"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter your email address and we'll send you a verification code."}
            {step === 2 && `Enter the verification code sent to ${email}`}
            {step === 3 && "Create a new password for your account"}
            {step === 4 && "Your password has been reset successfully"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <ForgotPasswordForm onSubmit={handleSendOtp} isLoading={isLoading} error={error} setEmail={setEmail} />
        )}

        {step === 2 && (
          <OtpVerificationForm onSubmit={handleVerifyOtp} isLoading={isLoading} error={error} email={email} />
        )}

        {step === 3 && <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} error={error} />}

        {step === 4 && <SuccessMessage />}
      </DialogContent>
    </Dialog>
  )
}
