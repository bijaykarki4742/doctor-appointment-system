// ---------- FRONTEND HOOK ----------

"use client"

import { useState } from "react"

export function useForgotPassword({ onComplete }) {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")

  const resetFlow = () => {
    setStep(1)
    setEmail("")
    setOtp("")
    setError("")
    setIsLoading(false)
  }

  const handleSendOtp = async (email) => {
  setIsLoading(true)
  setError("")

  try {
    const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP")
    }

    setEmail(email)
    setStep(2)
  } catch (err) {
    setError(err.message || "Unexpected error")
  } finally {
    setIsLoading(false)
  }
}


  const handleVerifyOtp = async (inputOtp) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate verification or use a real endpoint
      setOtp(inputOtp)
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (password) => {
  setIsLoading(true)
  setError("")

  try {
    const res = await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to reset password")
    }

    setStep(4)
    if (onComplete) onComplete()
  } catch (err) {
    setError(err.message || "Unexpected error")
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

// ---------- MOCK BACKEND HANDLERS FOR DEMO PURPOSES ----------

// These would normally live in: /pages/api/forgot-password.js and /pages/api/reset-password.js

export async function forgotPasswordApiHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    console.log(`Sending OTP to ${email}`)
    return res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP" })
  }
}

export async function resetPasswordApiHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { email, otp, password } = req.body

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "Email, OTP, and password are required" })
  }

  try {
    if (otp !== "123456") {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    console.log(`Password reset for ${email}`)
    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password" })
  }
}
