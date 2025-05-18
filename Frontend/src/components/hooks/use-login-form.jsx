// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"

// export function useLoginForm({ onSuccess }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting: formIsSubmitting },
//   } = useForm()

//   const [error, setError] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)

//   const onSubmit = async (data) => {
//     setError("")
//     setIsSubmitting(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // For demo purposes, show error for specific email
//       if (data.email === "error@example.com") {
//         throw new Error("Invalid credentials")
//       }

//       // If remember me is checked, store in localStorage
//       if (rememberMe) {
//         localStorage.setItem("rememberedEmail", data.email)
//       } else {
//         localStorage.removeItem("rememberedEmail")
//       }

//       // Success callback
//       if (onSuccess) {
//         onSuccess()
//       }
//     } catch (err) {
//       setError(err.message || "An error occurred during login")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return {
//     register,
//     handleSubmit,
//     formState: { errors },
//     isSubmitting: formIsSubmitting || isSubmitting,
//     error,
//     rememberMe,
//     setRememberMe,
//     onSubmit,
//   }
// }
