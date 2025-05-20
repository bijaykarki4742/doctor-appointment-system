"use client"

import * as React from "react"
import { cn } from "@/components/lib/utils"

const InputOTPContext = React.createContext({})

const InputOTP = React.forwardRef(({ value = "", onChange, maxLength = 6, ...props }, ref) => {
  const [otp, setOtp] = React.useState(value.split(""))
  const inputRefs = React.useRef([])

  React.useEffect(() => {
    if (value) {
      setOtp(value.split(""))
    }
  }, [value])

  const handleChange = (index, newValue) => {
    const newOtp = [...otp]
    newOtp[index] = newValue

    // Update state
    setOtp(newOtp)

    // Call onChange with the joined value
    const joinedValue = newOtp.join("")
    onChange?.(joinedValue)

    // Auto-focus next input if value is entered
    if (newValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Move focus to next input on right arrow
    if (e.key === "ArrowRight" && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Move focus to previous input on left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, maxLength)

    if (pastedData) {
      const newOtp = pastedData.split("").slice(0, maxLength)
      while (newOtp.length < maxLength) {
        newOtp.push("")
      }

      setOtp(newOtp)
      onChange?.(newOtp.join(""))

      // Focus the last filled input or the first empty one
      const lastFilledIndex = newOtp.findLastIndex((val) => val !== "")
      const focusIndex = lastFilledIndex < maxLength - 1 ? lastFilledIndex + 1 : lastFilledIndex
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const contextValue = React.useMemo(
    () => ({
      otp,
      maxLength,
      handleChange,
      handleKeyDown,
      handlePaste,
      inputRefs,
    }),
    [otp, maxLength],
  )

  return (
    <InputOTPContext.Provider value={contextValue}>
      <div ref={ref} className="flex items-center gap-2" {...props} />
    </InputOTPContext.Provider>
  )
})
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const { otp, handleChange, handleKeyDown, handlePaste, inputRefs } = React.useContext(InputOTPContext)

  const setInputRef = (el) => {
    inputRefs.current[index] = el
    if (typeof ref === "function") {
      ref(el)
    } else if (ref) {
      ref.current = el
    }
  }

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        "focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background",
        className,
      )}
      {...props}
    >
      <input
        ref={setInputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={otp[index] || ""}
        onChange={(e) => handleChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={index === 0 ? handlePaste : undefined}
        className="absolute inset-0 w-full h-full text-center bg-transparent border-0 focus:outline-none focus:ring-0"
      />
      {!otp[index] && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
