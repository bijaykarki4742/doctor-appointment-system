import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // Setup react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to handle form submission
    const onSubmit = async (data: any) => {
        console.log('Form Data:', data);

        // Prepare data for login API call
        const { email, password } = data;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);


                setIsLoggedIn(true);
                navigate('/');
            } else {
                const error = await response.json();
                console.error('Login failed:', error.message);
                // Handle login failure
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center w-full px-30 py-20 h-[100vh] bg-white">
            <div className="flex flex-col w-1/2 items-start justify-start">
                <div>
                    <h1 className="text-[44px] font-bold text-green-600">EasyCare</h1>
                    <h3 className="text-[28px] font-semibold">Getting Started with Appointment</h3>
                </div>

                <div className="flex flex-col items-start mt-10 gap-4">
                    {/* Full Name Field (Optional in Login) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="fullName">Full Name</label>
                        <Input
                            {...register('fullName')}
                            id="fullName"
                            placeholder="Enter your Full Name"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email Address</label>
                        <Input
                            {...register('email', { required: "Email is required" })}
                            id="email"
                            type="email"
                            placeholder="Enter your Email"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <Input
                            {...register('password', { required: "Password is required" })}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex w-full justify-center items-start">
                    <Button className='m-2' onClick={handleSubmit(onSubmit)}>Login</Button>
                </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center w-1/2 items-center">
                <img src="/Doctor.png" alt="Doctor illustration" />
            </div>
        </div>
    );
};

export default Login;
