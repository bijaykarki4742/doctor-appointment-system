import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '@/Contexts/AuthContext';

const Login = () => {
    // Setup react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const {login} = useAuth(); 

    const [error, setError] = useState('');

    // Function to handle form submission
    const onSubmit = async (data) => {

        setError('');

        // Prepare data for login API call
        const loginData = {
            email: data.email,
            password: data.password
        };

        try {
            const response = await api.post('/auth/login', loginData);

            if (response.data.success) {
                login(response.data.token, {
                  name: response.data.user.name, // Make sure backend returns name
                  email: response.data.user.email
                });
                navigate('/');
              }
            else {
                throw new Error(response.data.error || 'Login failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error ||
                err.message ||
                'An error occurred during signup';
            setError(errorMessage);
            console.error('Signup error:', err.response?.data || err.message);
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
                <img src="/docimg.png" alt="Doctor illustration" />
            </div>
        </div>
    );
};

export default Login;
