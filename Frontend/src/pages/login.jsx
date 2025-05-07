import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '@/Contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                login(response.data.token, {
                    name: response.data.user.name,
                    email: response.data.user.email
                });
                navigate('/');
            } else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error ||
                err.message ||
                'An error occurred during login';
            setError(errorMessage);
            console.error('Login error:', err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-12">
                    <div className="mb-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text">
                            EasyCare
                        </h1>
                        <h3 className="text-2xl font-semibold text-gray-700">Welcome back!</h3>
                        <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                {...register('email', {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                id="email"
                                type="email"
                                placeholder="Enter your Email"
                                className="py-6 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Input
                                    {...register('password', {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="py-6 px-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 text-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        {/* Sign Up Redirect */}
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-teal-500 hover:text-green-700 font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right Side - Image */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-50 to-teal-100 items-center justify-center p-12">
                    <div className="text-center">
                        <img
                            src="/docimg.png"
                            alt="Doctor illustration"
                            className="max-w-full h-auto max-h-96 object-contain"
                        />
                        <h3 className="text-2xl font-semibold text-gray-800 mt-6">Easy Appointment Management</h3>
                        <p className="text-gray-600 mt-2">
                            Streamline your healthcare experience with our easy-to-use platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;