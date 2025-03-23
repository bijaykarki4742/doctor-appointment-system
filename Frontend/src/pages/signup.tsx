import { useState } from 'react';
import { Input } from '@/components/ui/input';

const Signup = () => {
    const [role, setRole] = useState('Patient');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    return (
        <>
            <div className="flex items-start w-full px-20 py-30 h-full bg-white">
                <div className="flex flex-col w-1/2 items-start justify-start">
                    <div>
                        <h1 className="text-[44px] font-bold text-green-600">EasyCare</h1>
                        <h3 className="text-[28px] font-semibold">Create Your Account</h3>
                    </div>

                    <div className="flex flex-col items-start mt-10 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <Input className='bg-green-200 ' id="name" placeholder="Enter your name" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">Email Address</label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password">Password</label>
                            <Input id="password" type="password" placeholder="Enter your password" />
                        </div>

                        {/* Role Selection Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                className="border w-[300px] bg-green-200 rounded-lg p-2"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Patient">Patient</option>
                                <option value="Doctor">Doctor</option>
                            </select>
                        </div>

                        {/* Conditional Fields for Doctors */}
                        {role === 'Doctor' && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact">Contact Number</label>
                                    <Input id="contact" type="tel" placeholder="Enter your contact number" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="specialty">Specialty</label>
                                    <select id="specialty" className="w-[300px] bg-green-200 border rounded-lg p-2">
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
                                    <Input id="license" placeholder="Enter your medical license number" />
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-sm">
                                I agree to the <a href="#" className="text-green-600 underline">Terms & Conditions</a>.
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            disabled={!agreedToTerms}
                            className={`mt-6 px-4 py-2 rounded-lg text-white ${
                                agreedToTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Create Account
                        </button>
                    </div>
                </div>

                <div className="flex justify-center w-1/2 items-center">
                    <img src="public/Doctor.png" alt="Signup Illustration" />
                </div>
            </div>
        </>
    );
};

export default Signup;
