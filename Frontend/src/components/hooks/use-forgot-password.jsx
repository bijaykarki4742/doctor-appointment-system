"use client"

import { useState } from "react"

export function useForgotPassword({ onComplete }) {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentOtp, setCurrentOtp] = useState("")

  const resetFlow = () => {
    setStep(1)
    setEmail("")
    setCurrentOtp("")
    setError("")
    setIsLoading(false)
  }

  const handleSendOtp = async (email) => {
    setIsLoading(true)
    setError("")

    try {
      // Call the forgot-password API endpoint
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON response
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server error. Please try again later.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code")
      }

      setEmail(email)
      setStep(2) // Move to OTP verification step
    } catch (err) {
      // Handle fetch errors (network errors, JSON parsing errors, etc.)
      console.error("Error in forgot password:", err)
      setError(err.message || "Failed to send verification code. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (otp) => {
    setIsLoading(true)
    setError("")

    try {
      // For now, we'll keep the client-side verification
      // In a real app, you would call an API endpoint to verify the OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, show error for specific OTP
      if (otp === "000000") {
        throw new Error("Invalid verification code")
      }

      setCurrentOtp(otp) // Store the OTP for the reset password call
      setStep(3) // Move to password reset step
    } catch (err) {
      setError(err.message || "Failed to verify code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (password) => {
    setIsLoading(true)
    setError("")

    try {
      // Call the reset-password API endpoint
      const response = await fetch("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: currentOtp,
          password,
        }),
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON response
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server error. Please try again later.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      setStep(4) // Success

      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      // Handle fetch errors (network errors, JSON parsing errors, etc.)
      console.error("Error in reset password:", err)
      setError(err.message || "Failed to reset password. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    step,
    email,
    setEmail,
    isLoading,
    error,
    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword,
    resetFlow,
  }
}
