import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    // @ts-ignore
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [role, setRole] = useState('Patient');
    const agreedToTerms = watch("terms", false);

    const navigate = useNavigate();

    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignedIn, setisSignedIn] = useState(false);

    const onSubmit = async (data) => {
        console.log("Form Data:", data);

        // Prepare the data to be sent
        const { name, email, password, confirmPassword, role, contact, specialty, license, terms } = data;

        // Ensure the backend API expects this data in the right format
        const requestData = {
            name,
            email,
            password,
            confirmPassword,
            role,
            contact,
            specialty,
            license,
        };

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Signup successful:', result);
                setisSignedIn(true);
                navigate('/login');
            } else {
                const error = await response.json();
                console.error('Signup failed:', error.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start w-full px-20 py-30 h-full bg-white">
            <div className="flex flex-col w-1/2 items-start justify-start">
                <div>
                    <h1 className="text-[44px] font-bold text-green-600">EasyCare</h1>
                    <h3 className="text-[28px] font-semibold">Create Your Account</h3>
                </div>

                <div className="flex flex-col items-start mt-10 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Name</label>
                        <Input {...register("name", { required: "Name is required" })} id="name" placeholder="Enter your name" />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email Address</label>
                        <Input {...register("email", { required: "Email is required" })} id="email" type="email" placeholder="Enter your email" />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <Input {...register("password", { required: "Password is required" })} id="password" type="password" placeholder="Enter your password" />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            {...register("role")}
                            className="border w-[300px] bg-green-200 rounded-lg p-2"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                    </div>

                    {role === 'Doctor' && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="contact">Contact Number</label>
                                <Input {...register("contact")} id="contact" type="tel" placeholder="Enter your contact number" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="specialty">Specialty</label>
                                <select id="specialty" {...register("specialty")} className="w-[300px] bg-green-200 border rounded-lg p-2">
                                    <option value="">Select your specialty</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="license">Medical License Number</label>
                                <Input {...register("license")} id="license" placeholder="Enter your medical license number" />
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <Input {...register("confirmPassword", { required: "Please confirm your password" })} id="confirmPassword" type="password" placeholder="Confirm your password" />
                        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="flex items-start gap-2">
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
                        disabled={!agreedToTerms}
                        className={`mt-6 px-4 py-2 rounded-lg text-white ${agreedToTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Create Account
                    </button>
                </div>
            </div>

            <div className="flex justify-center w-1/2 items-center">
                <img src="public/Doctor.png" alt="Signup Illustration" />
            </div>
        </form>
    );
};

export default Signup;
