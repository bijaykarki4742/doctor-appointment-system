import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors, isSubmitting } 
    } = useForm({
        defaultValues: {
            role: 'Patient'
        }
    });

    const role = watch("role");
    const agreedToTerms = watch("terms", false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError(''); // Clear previous errors
        
        // Validate password match
        if (data.password !== data.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        // Prepare request data
        const requestData = {
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            ...(data.role === 'Doctor' && {
                contact: data.contact,
                specialty: data.specialty,
                license: data.license
            })
        };

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                credentials: 'include' // If using cookies
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Signup failed');
            }

            console.log('Signup successful:', result);
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'An error occurred during signup');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start w-full px-20 py-30 h-full bg-white">
            <div className="flex flex-col w-1/2 items-start justify-start">
                <div>
                    <h1 className="text-[44px] font-bold text-green-600">EasyCare</h1>
                    <h3 className="text-[28px] font-semibold">Create Your Account</h3>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded w-full">
                        {error}
                    </div>
                )}

                <div className="flex flex-col items-start mt-10 gap-4 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="name">Name</label>
                        <Input 
                            {...register("name", { 
                                required: "Name is required",
                                minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters"
                                }
                            })} 
                            id="name" 
                            placeholder="Enter your name" 
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="email">Email Address</label>
                        <Input 
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })} 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email" 
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="password">Password</label>
                        <Input 
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })} 
                            id="password" 
                            type="password" 
                            placeholder="Enter your password" 
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Input 
                            {...register("confirmPassword", { 
                                required: "Please confirm your password"
                            })} 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="Confirm your password" 
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            {...register("role")}
                            className="border w-full bg-green-200 rounded-lg p-2"
                        >
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                    </div>

                    {role === 'Doctor' && (
                        <>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="contact">Contact Number</label>
                                <Input 
                                    {...register("contact", { 
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^[0-9]{10,15}$/,
                                            message: "Invalid phone number"
                                        }
                                    })} 
                                    id="contact" 
                                    type="tel" 
                                    placeholder="Enter your contact number" 
                                />
                                {errors.contact && <span className="text-red-500 text-sm">{errors.contact.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="specialty">Specialty</label>
                                <select 
                                    id="specialty" 
                                    {...register("specialty", { 
                                        required: "Specialty is required"
                                    })} 
                                    className="w-full bg-green-200 border rounded-lg p-2"
                                >
                                    <option value="">Select your specialty</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                                {errors.specialty && <span className="text-red-500 text-sm">{errors.specialty.message}</span>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="license">Medical License Number</label>
                                <Input 
                                    {...register("license", { 
                                        required: "License number is required"
                                    })} 
                                    id="license" 
                                    placeholder="Enter your medical license number" 
                                />
                                {errors.license && <span className="text-red-500 text-sm">{errors.license.message}</span>}
                            </div>
                        </>
                    )}

                    <div className="flex items-start gap-2 mt-2">
                        <input
                            type="checkbox"
                            {...register("terms", { required: "You must agree to the terms" })}
                            id="terms"
                        />
                        <label htmlFor="terms" className="text-sm">
                            I agree to the <a href="#" className="text-green-600 underline">Terms & Conditions</a>.
                        </label>
                    </div>
                    {errors.terms && <span className="text-red-500 text-sm">{errors.terms.message}</span>}

                    <button
                        type="submit"
                        disabled={!agreedToTerms || isSubmitting}
                        className={`mt-6 px-4 py-2 rounded-lg text-white w-full ${
                            !agreedToTerms || isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </div>

            <div className="flex justify-center w-1/2 items-center">
                <img src="/Doctor.png" alt="Signup Illustration" className="max-w-full h-auto" />
            </div>
        </form>
    );
};

export default Signup;