"use client"

import { CheckCircle } from "lucide-react"

export default function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium">Password Reset Successful</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Your password has been reset successfully. You can now log in with your new password.
      </p>
    </div>
  )
}

