"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  Calendar,
  Shield,
  FileText,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import Link from "next/link"
import api from "../api/axios"
import {Link} from "react-router-dom"

const Signup = () => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState("patient")
  const [error, setError] = useState("")
  const [formProgress, setFormProgress] = useState(0)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      role: "patient",
      gender: "male",
      age: 0,
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      insuranceInfo: {
        provider: "",
        policyNumber: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  })

  const watchedRole = watch("role")
  const agreedToTerms = watch("terms", false)
  const watchedFields = watch()

  // Update role state when form role changes
  useEffect(() => {
    setRole(watchedRole)
  }, [watchedRole])

  // Calculate form progress
  useEffect(() => {
    const totalFields = role === "patient" ? 20 : 15
    const filledFields = Object.keys(dirtyFields).length
    setFormProgress(Math.min(100, Math.round((filledFields / totalFields) * 100)))
  }, [dirtyFields, role])

  // Calculate age from date of birth
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0
    const today = new Date()
    const birthDateObj = new Date(birthDate)
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }
    return age
  }

  const handleRoleChange = (value) => {
    setValue("role", value)
    setRole(value)
  }

  const nextStep = async () => {
    let fieldsToValidate = []

    if (step === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "contact", "password", "confirmPassword"]
    } else if (step === 2) {
      if (role === "doctor") {
        fieldsToValidate = ["specialization", "licenseNumber", "experience", "qualifications"]
      } else {
        fieldsToValidate = [
          "dateOfBirth",
          "gender",
          "address.street",
          "address.city",
          "address.state",
          "address.country",
        ]
      }
    }

    const result = await trigger(fieldsToValidate)
    if (result) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const onSubmit = async (data) => {
    setError("")

    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    const requestData = {
      email: data.email,
      password: data.password,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      contact: data.contact,
      // Patient-specific
      ...(data.role === "patient" && {
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        gender: data.gender,
        address: data.address,
        insuranceInfo: data.insuranceInfo,
        medicalHistory:
          typeof data.medicalHistory === "string"
            ? data.medicalHistory
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean)
            : data.medicalHistory || [],
        allergies:
          typeof data.allergies === "string"
            ? data.allergies
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : data.allergies || [],
        emergencyContact: data.emergencyContact,
      }),
      // Doctor-specific
      ...(data.role === "doctor" && {
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        experience: Number(data.experience) || 0,
        gender: data.gender || "male",
        age: calculateAge(data.dateOfBirth),
        qualifications:
          typeof data.qualifications === "string"
            ? data.qualifications
                .split(",")
                .map((q) => q.trim())
                .filter(Boolean)
            : data.qualifications || [],
        hospitalAffiliation:
          typeof data.hospitalAffiliation === "string"
            ? data.hospitalAffiliation
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : data.hospitalAffiliation || [],
        bio: data.bio || "",
        languagesSpoken:
          typeof data.languagesSpoken === "string"
            ? data.languagesSpoken
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean)
            : data.languagesSpoken || [],
      }),
    }

    try {
      const response = await api.post("/auth/signup", requestData)

      if (response.data.success) {
        // Show success animation before redirecting
        setStep(4) // Success step
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        throw new Error(response.data.error || "Signup failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "An error occurred during signup"
      setError(errorMessage)
      console.error("Signup error:", err.response?.data || err.message)
    }
  }

  // Render progress bar
  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
      <div
        className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${formProgress}%` }}
      ></div>
    </div>
  )

  // Render step indicators
  const renderStepIndicators = () => (
    <div className="flex justify-between items-center w-full mb-8 relative">
      <div className="absolute h-1 bg-gray-200 top-1/2 -translate-y-1/2 left-0 right-0 z-0"></div>

      {[1, 2, 3].map((stepNumber) => (
        <div
          key={stepNumber}
          className={`flex items-center justify-center rounded-full z-10 transition-all duration-300
            ${step >= stepNumber ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"}
            ${step === stepNumber ? "w-10 h-10 ring-4 ring-teal-100" : "w-8 h-8"}
          `}
        >
          {step > stepNumber ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-white">
      {/* Left side - Form */}
      <div className="flex flex-col w-full lg:w-2/3 p-6 md:p-12">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-teal-600 mb-2">EasyCare</h1>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Create Your Account</h2>
                <p className="text-gray-500">Join our healthcare platform in just a few steps</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Already have an account?</span>
                <Link href="/login" to="/login" className="text-teal-600 font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {renderProgressBar()}
          {renderStepIndicators()}

          {error && (
            <Alert variant="destructive" className="mb-6 animate-fadeIn">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="border-none shadow-lg animate-fadeIn overflow-hidden">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-xl flex items-center">
                {step === 1 && (
                  <>
                    <User className="mr-2 h-5 w-5 text-teal-500" />
                    Account Information
                  </>
                )}
                {step === 2 && (
                  <>
                    {role === "doctor" ? (
                      <>
                        <Stethoscope className="mr-2 h-5 w-5 text-teal-500" />
                        Professional Details
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5 text-teal-500" />
                        Personal Information
                      </>
                    )}
                  </>
                )}
                {step === 3 && (
                  <>
                    {role === "doctor" ? (
                      <>
                        <FileText className="mr-2 h-5 w-5 text-teal-500" />
                        Additional Information
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5 text-teal-500" />
                        Medical Information
                      </>
                    )}
                  </>
                )}
                {step === 4 && (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5 text-teal-500" />
                    Registration Complete
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Enter your basic account details"}
                {step === 2 &&
                  (role === "doctor" ? "Tell us about your medical practice" : "Provide your personal information")}
                {step === 3 &&
                  (role === "doctor"
                    ? "Add more details about your practice"
                    : "Share your medical history and emergency contacts")}
                {step === 4 && "Your account has been created successfully"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Account Information */}
                {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                      <div className="flex-1">
                        <Label htmlFor="role" className="text-sm font-medium mb-1.5 block">
                          I am registering as a
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${
                                role === "patient"
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-teal-200"
                              }
                            `}
                            onClick={() => handleRoleChange("patient")}
                          >
                            <User
                              className={`mr-2 h-5 w-5 ${role === "patient" ? "text-teal-500" : "text-gray-400"}`}
                            />
                            <span className={role === "patient" ? "font-medium text-teal-700" : "text-gray-600"}>
                              Patient
                            </span>
                          </div>
                          <div
                            className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${
                                role === "doctor"
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-teal-200"
                              }
                            `}
                            onClick={() => handleRoleChange("doctor")}
                          >
                            <Stethoscope
                              className={`mr-2 h-5 w-5 ${role === "doctor" ? "text-teal-500" : "text-gray-400"}`}
                            />
                            <span className={role === "doctor" ? "font-medium text-teal-700" : "text-gray-600"}>
                              Doctor
                            </span>
                          </div>
                        </div>
                        <input type="hidden" {...register("role")} value={role} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          {...register("firstName", {
                            required: "First name is required",
                            minLength: {
                              value: 2,
                              message: "Must be at least 2 characters",
                            },
                          })}
                          id="firstName"
                          placeholder="Enter your first name"
                          className={`transition-all duration-300 ${errors.firstName ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          {...register("lastName", {
                            required: "Last name is required",
                            minLength: {
                              value: 2,
                              message: "Must be at least 2 characters",
                            },
                          })}
                          id="lastName"
                          placeholder="Enter your last name"
                          className={`transition-all duration-300 ${errors.lastName ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className={`transition-all duration-300 ${errors.email ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-medium">
                        Contact Number
                      </Label>
                      <div className="relative">
                        <Input
                          {...register("contact", {
                            required: "Contact is required",
                            pattern: {
                              value: /^[0-9]{10,15}$/,
                              message: "Invalid phone number",
                            },
                          })}
                          id="contact"
                          type="tel"
                          placeholder="Enter your contact number"
                          className={`transition-all duration-300 ${errors.contact ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                      </div>
                      {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Input
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Must be at least 6 characters",
                            },
                          })}
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          className={`transition-all duration-300 ${errors.password ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </Label>
                        <Input
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) => value === watch("password") || "Passwords don't match",
                          })}
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className={`transition-all duration-300 ${errors.confirmPassword ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Role-specific information */}
                {step === 2 && role === "doctor" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-sm font-medium">
                        Specialization
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("specialization", value)}
                        defaultValue={watchedFields.specialization}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Dermatology">Dermatology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                          <SelectItem value="Gynecology">Gynecology</SelectItem>
                          <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="Urology">Urology</SelectItem>
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        {...register("specialization", { required: "Specialization is required" })}
                        value={watchedFields.specialization || ""}
                      />
                      {errors.specialization && (
                        <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber" className="text-sm font-medium">
                          License Number
                        </Label>
                        <Input
                          {...register("licenseNumber", {
                            required: "License number is required",
                          })}
                          id="licenseNumber"
                          placeholder="Medical license number"
                          className={`transition-all duration-300 ${errors.licenseNumber ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.licenseNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.licenseNumber.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium">
                          Years of Experience
                        </Label>
                        <Input
                          {...register("experience")}
                          id="experience"
                          type="number"
                          placeholder="Years"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualifications" className="text-sm font-medium">
                        Qualifications (comma separated)
                      </Label>
                      <Input
                        {...register("qualifications", {
                          required: "Qualifications are required",
                        })}
                        id="qualifications"
                        placeholder="MD, MBBS, etc."
                        className={`transition-all duration-300 ${errors.qualifications ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                      />
                      {errors.qualifications && (
                        <p className="text-red-500 text-sm mt-1">{errors.qualifications.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Input
                          {...register("dateOfBirth")}
                          id="dateOfBirth"
                          type="date"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </Label>
                        <Select
                          onValueChange={(value) => setValue("gender", value)}
                          defaultValue={watchedFields.gender}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <input type="hidden" {...register("gender")} value={watchedFields.gender || "male"} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && role === "patient" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Input
                          {...register("dateOfBirth", {
                            required: "Date of birth is required",
                          })}
                          id="dateOfBirth"
                          type="date"
                          className={`transition-all duration-300 ${errors.dateOfBirth ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender
                        </Label>
                        <Select
                          onValueChange={(value) => setValue("gender", value)}
                          defaultValue={watchedFields.gender}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          type="hidden"
                          {...register("gender", { required: "Gender is required" })}
                          value={watchedFields.gender || "male"}
                        />
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Address</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            {...register("address.street", {
                              required: "Street is required",
                            })}
                            placeholder="Street"
                            className={`transition-all duration-300 ${errors.address?.street ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                          />
                          {errors.address?.street && (
                            <p className="text-red-500 text-sm">{errors.address.street.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            {...register("address.city", {
                              required: "City is required",
                            })}
                            placeholder="City"
                            className={`transition-all duration-300 ${errors.address?.city ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                          />
                          {errors.address?.city && (
                            <p className="text-red-500 text-sm">{errors.address.city.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            {...register("address.state", {
                              required: "State is required",
                            })}
                            placeholder="State"
                            className={`transition-all duration-300 ${errors.address?.state ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                          />
                          {errors.address?.state && (
                            <p className="text-red-500 text-sm">{errors.address.state.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            {...register("address.postalCode")}
                            placeholder="Postal Code"
                            className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Input
                            {...register("address.country", {
                              required: "Country is required",
                            })}
                            placeholder="Country"
                            className={`transition-all duration-300 ${errors.address?.country ? "border-red-500" : "hover:border-teal-400 focus:border-teal-500"}`}
                          />
                          {errors.address?.country && (
                            <p className="text-red-500 text-sm">{errors.address.country.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Information */}
                {step === 3 && role === "doctor" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-2">
                      <Label htmlFor="hospitalAffiliation" className="text-sm font-medium">
                        Hospital Affiliations (comma separated)
                      </Label>
                      <Input
                        {...register("hospitalAffiliation")}
                        id="hospitalAffiliation"
                        placeholder="Hospital names"
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationFee" className="text-sm font-medium">
                        Consultation Fee (USD)
                      </Label>
                      <Input
                        {...register("consultationFee")}
                        id="consultationFee"
                        type="number"
                        placeholder="Fee amount"
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languagesSpoken" className="text-sm font-medium">
                        Languages Spoken (comma separated)
                      </Label>
                      <Input
                        {...register("languagesSpoken")}
                        id="languagesSpoken"
                        placeholder="English, Spanish, etc."
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Professional Bio
                      </Label>
                      <Textarea
                        {...register("bio")}
                        id="bio"
                        placeholder="Tell patients about your professional background and approach"
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500 min-h-[100px]"
                      />
                    </div>

                    <div className="flex items-start gap-2 mt-4">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => {
                          setValue("terms", checked === true)
                          trigger("terms")
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the Terms & Conditions
                        </label>
                        <p className="text-sm text-muted-foreground">
                          By creating an account, you agree to our{" "}
                          {/* <Link href="#" className="text-teal-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-teal-600 hover:underline">
                            Privacy Policy
                          </Link> */}
                          .
                        </p>
                      </div>
                      <input
                        type="hidden"
                        {...register("terms", { required: "You must agree to the terms" })}
                        value={agreedToTerms ? "true" : "false"}
                      />
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
                  </div>
                )}

                {step === 3 && role === "patient" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Insurance Information</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          {...register("insuranceInfo.provider")}
                          placeholder="Provider"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                        <Input
                          {...register("insuranceInfo.policyNumber")}
                          placeholder="Policy Number"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalHistory" className="text-sm font-medium">
                        Medical History (comma separated)
                      </Label>
                      <Textarea
                        {...register("medicalHistory")}
                        id="medicalHistory"
                        placeholder="Conditions, surgeries, etc."
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500 min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-sm font-medium">
                        Allergies (comma separated)
                      </Label>
                      <Input
                        {...register("allergies")}
                        id="allergies"
                        placeholder="List of allergies"
                        className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Emergency Contact</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          {...register("emergencyContact.name")}
                          placeholder="Name"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                        <Input
                          {...register("emergencyContact.relationship")}
                          placeholder="Relationship"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500"
                        />
                        <Input
                          {...register("emergencyContact.phone")}
                          placeholder="Phone"
                          className="transition-all duration-300 hover:border-teal-400 focus:border-teal-500 md:col-span-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-4">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => {
                          setValue("terms", checked === true)
                          trigger("terms")
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the Terms & Conditions
                        </label>
                        <p className="text-sm text-muted-foreground">
                          By creating an account, you agree to our{" "}
                          {/* <Link href="#" className="text-teal-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-teal-600 hover:underline">
                            Privacy Policy
                          </Link> */}
                          .
                        </p>
                      </div>
                      <input
                        type="hidden"
                        {...register("terms", { required: "You must agree to the terms" })}
                        value={agreedToTerms ? "true" : "false"}
                      />
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
                  </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                  <div className="py-8 text-center animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
                    <p className="text-gray-500 mb-6">Your account has been created successfully.</p>
                    <p className="text-gray-500">You will be redirected to the login page shortly...</p>
                  </div>
                )}
              </form>
            </CardContent>

            {step < 4 && (
              <CardFooter className="flex justify-between border-t pt-6">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex items-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!agreedToTerms || isSubmitting}
                    className={`flex items-center ${!agreedToTerms ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex w-1/3 bg-teal-50 items-center justify-center p-12">
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="relative">
            <img src="/docimg.png" alt="Signup Illustration" className="rounded-lg shadow-2xl animate-float" />

            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-4/5">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Join our healthcare community</p>
                  <p className="text-xs text-gray-500">Connect with patients and healthcare providers</p>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="absolute -top-10 -right-10 bg-white p-4 rounded-lg shadow-lg animate-float animation-delay-2000">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-teal-500" />
                  <p className="text-sm font-medium">Create your profile</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="absolute -top-10 -right-10 bg-white p-4 rounded-lg shadow-lg animate-float animation-delay-2000">
                <div className="flex items-center space-x-2">
                  {role === "doctor" ? (
                    <>
                      <Stethoscope className="h-5 w-5 text-teal-500" />
                      <p className="text-sm font-medium">Add your credentials</p>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5 text-teal-500" />
                      <p className="text-sm font-medium">Personal details</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="absolute -top-10 -right-10 bg-white p-4 rounded-lg shadow-lg animate-float animation-delay-2000">
                <div className="flex items-center space-x-2">
                  {role === "doctor" ? (
                    <>
                      <FileText className="h-5 w-5 text-teal-500" />
                      <p className="text-sm font-medium">Complete your profile</p>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 text-teal-500" />
                      <p className="text-sm font-medium">Medical information</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup