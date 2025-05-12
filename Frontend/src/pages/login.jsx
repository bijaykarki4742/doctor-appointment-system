import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Lock, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import Link from "next/link"
import api from "../api/axios"
import { useAuth } from "@/Contexts/AuthContext"
import ForgotPasswordDialog from "@/containers/ForgotPassword/forgot-password-dialog"
const Login = () => {
  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  // Function to handle form submission
  const onSubmit = async (data) => {
    console.log("Form Data:", data)
    setError("")

    // Prepare data for login API call
    const loginData = {
      email: data.email,
      password: data.password,
    }

    try {
      const response = await api.post("/auth/login", loginData)


      if (response.data.success) {
        login(response.data.token, {
          name: response.data.user.name,
          email: response.data.user.email,
        })
        navigate("/")
      } else {
        throw new Error(response.data.error || "Login failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "An error occurred during login"
      setError(errorMessage)
       console.error("Login error:", err.response?.data || err.message)

    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-white">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 md:p-12">
        <div className="">
          <div className="mb-8 text-center animate-fadeIn">
            <h1 className="text-4xl p-[20px] md:text-5xl font-bold text-teal-600 mb-2">EasyCare</h1>
            <p className="text-xl md:text-2xl font-medium text-gray-700">Welcome back</p>
            <p className="text-gray-500">Sign in to manage your appointments</p>
          </div>

          <Card className="py-[20px] border-none shadow-lg animate-fadeIn">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Login to your account</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                      className={`pl-10 ${errors.email ? "border-red-500" : ""} transition-all duration-300 hover:border-teal-400 focus:border-teal-500`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                   
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("password", { required: "Password is required" })}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 ${errors.password ? "border-red-500" : ""} transition-all duration-300 hover:border-teal-400 focus:border-teal-500`}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between ">
  <div className="flex items-center space-x-2">
    <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
    <label
      htmlFor="remember"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Remember me
    </label>
  </div>
  <Button
                variant="link"
                className="p-0 h-auto"
                onClick={(e) => {
                  e.preventDefault()
                  setForgotPasswordOpen(true)
                }}
              >
                Forgot password?
  {/* <a href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
    Forgot password?
  </a> */}
              </Button>
</div>


                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Sign in <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            {/* <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                  Create account
                </Link>
              </p>
            </CardFooter> */}
          </Card>
          <ForgotPasswordDialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex w-1/2 bg-teal-50 items-center justify-center p-12">
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="relative">
            <img
              src="/Female Login Doctor.png"
              alt="Doctor illustration"
              className="rounded-lg shadow-2xl animate-float"
            />
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
                  <p className="text-sm font-medium text-gray-900">Easy appointment booking</p>
                  <p className="text-xs text-gray-500">Book and manage your healthcare appointments with ease</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Login;
