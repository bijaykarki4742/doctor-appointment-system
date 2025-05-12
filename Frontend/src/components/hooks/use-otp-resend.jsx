"use client"

import { useState, useEffect } from "react"

export function useOtpResend(initialCountdown = 60) {
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(initialCountdown)

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleResend = async () => {
    setCanResend(false)
    setCountdown(initialCountdown)

    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("OTP resent")
    } catch (error) {
      console.error("Error resending OTP:", error)
      // If there's an error, allow immediate resend
      setCanResend(true)
    }
  }

  return {
    canResend,
    countdown,
    handleResend,
  }
}
