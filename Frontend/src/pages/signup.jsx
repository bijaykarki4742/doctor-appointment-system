import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Signup = () => {
    const {
        register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
            defaultValues: {
                role: 'patient',
                gender: 'male',
                age: 0,
                address: {
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: ''
                },
                insuranceInfo: {
                    provider: '',
                    policyNumber: ''
                },
                emergencyContact: {
                    name: '',
                    relationship: '',
                    phone: ''
                }
            }
        });

    const role = watch("role");
    const agreedToTerms = watch("terms", false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Calculate age from date of birth
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const onSubmit = async (data) => {
        setError('');

        if (data.password !== data.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        const requestData = {
            email: data.email,
            password: data.password,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            contact: data.contact,
            // Patient-specific
            ...(data.role === 'patient' && {
                dateOfBirth: new Date(data.dateOfBirth).toISOString(), // Convert to ISO string
                gender: data.gender,
                address: data.address,
                insuranceInfo: data.insuranceInfo,
                medicalHistory: typeof data.medicalHistory === 'string'
                    ? data.medicalHistory.split(',').map(m => m.trim()).filter(Boolean)
                    : data.medicalHistory || [],
                allergies: typeof data.allergies === 'string'
                    ? data.allergies.split(',').map(a => a.trim()).filter(Boolean)
                    : data.allergies || [],
                emergencyContact: data.emergencyContact,
            }),
            // Doctor-specific
            ...(data.role === 'doctor' && {
                specialization: data.specialization,
                licenseNumber: data.licenseNumber,
                experience: Number(data.experience) || 0, // Ensure number type
                gender: data.gender || 'Male', // Add gender for doctors
                age: calculateAge(data.dateOfBirth),
                qualifications: typeof data.qualifications === 'string'
                    ? data.qualifications.split(',').map(q => q.trim()).filter(Boolean)
                    : data.qualifications || [],
                hospitalAffiliation: typeof data.hospitalAffiliation === 'string'
                    ? data.hospitalAffiliation.split(',').map(h => h.trim()).filter(Boolean)
                    : data.hospitalAffiliation || [],
                bio: data.bio || "",
                languagesSpoken: typeof data.languagesSpoken === 'string'
                    ? data.languagesSpoken.split(',').map(l => l.trim()).filter(Boolean)
                    : data.languagesSpoken || [],
            })
        };

        try {
            const response = await api.post('/auth/signup', requestData);

            if (response.data.success) {
                navigate('/login');
            } else {
                throw new Error(response.data.error || 'Signup failed');
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start w-full px-20 py-12 h-full bg-white">
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

                <div className="flex flex-col items-start mt-6 gap-4 w-full">
                    {/* Common Fields */}
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="role">I am a</label>
                        <select
                            id="role"
                            {...register("role")}
                            className="border w-full rounded-lg p-2"
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="firstName">First Name</label>
                            <Input
                                {...register("firstName", {
                                    required: "First name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Must be at least 2 characters"
                                    }
                                })}
                                id="firstName"
                                placeholder="First name"
                            />
                            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="lastName">Last Name</label>
                            <Input
                                {...register("lastName", {
                                    required: "Last name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Must be at least 2 characters"
                                    }
                                })}
                                id="lastName"
                                placeholder="Last name"
                            />
                            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                        </div>
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
                        <label htmlFor="contact">Contact Number</label>
                        <Input
                            {...register("contact", {
                                required: "Contact is required",
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

                    <div className="flex gap-4 w-full">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="password">Password</label>
                            <Input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Must be at least 6 characters"
                                    }
                                })}
                                id="password"
                                type="password"
                                placeholder="Enter password"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 w-1/2">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Input
                                {...register("confirmPassword", {
                                    required: "Please confirm your password"
                                })}
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                            />
                        </div>
                    </div>

                    {/* Role-Specific Fields */}
                    {role === 'doctor' ? (
                        <>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="specialization">Specialization</label>
                                <select
                                    id="specialization"
                                    {...register("specialization", {
                                        required: "Specialization is required"
                                    })}
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="">Select your specialty</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                                {errors.specialization && <span className="text-red-500 text-sm">{errors.specialization.message}</span>}
                            </div>

                            <div className="flex gap-4 w-full">
                                <div className="flex flex-col gap-2 w-1/2">
                                    <label htmlFor="licenseNumber">License Number</label>
                                    <Input
                                        {...register("licenseNumber", {
                                            required: "License number is required"
                                        })}
                                        id="licenseNumber"
                                        placeholder="Medical license number"
                                    />
                                    {errors.licenseNumber && <span className="text-red-500 text-sm">{errors.licenseNumber.message}</span>}
                                </div>

                                <div className="flex flex-col gap-2 w-1/2">
                                    <label htmlFor="experience">Years of Experience</label>
                                    <Input
                                        {...register("experience")}
                                        id="experience"
                                        type="number"
                                        placeholder="Years"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="qualifications">Qualifications (comma separated)</label>
                                <Input
                                    {...register("qualifications")}
                                    id="qualifications"
                                    placeholder="MD, MBBS, etc."
                                />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="hospitalAffiliation">Hospital Affiliations (comma separated)</label>
                                <Input
                                    {...register("hospitalAffiliation")}
                                    id="hospitalAffiliation"
                                    placeholder="Hospital names"
                                />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="consultationFee">Consultation Fee (USD)</label>
                                <Input
                                    {...register("consultationFee")}
                                    id="consultationFee"
                                    type="number"
                                    placeholder="Fee amount"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-4 w-full">
                                <div className="flex flex-col gap-2 w-1/2">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <Input
                                        {...register("dateOfBirth", {
                                            required: "Date of birth is required"
                                        })}
                                        id="dateOfBirth"
                                        type="date"
                                    />
                                    {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth.message}</span>}
                                </div>

                                <div className="flex flex-col gap-2 w-1/2">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        {...register("gender", { required: "Gender is required" })}
                                        className="w-full border rounded-lg p-2"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender.message}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label>Address</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        {...register("address.street")}
                                        placeholder="Street"
                                    />
                                    <Input
                                        {...register("address.city")}
                                        placeholder="City"
                                    />
                                    <Input
                                        {...register("address.state")}
                                        placeholder="State"
                                    />
                                    <Input
                                        {...register("address.postalCode")}
                                        placeholder="Postal Code"
                                    />
                                    <Input
                                        {...register("address.country")}
                                        placeholder="Country"
                                        className="col-span-2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label>Insurance Information</label>
                                <div className="flex gap-2">
                                    <Input
                                        {...register("insuranceInfo.provider")}
                                        placeholder="Provider"
                                        className="w-1/2"
                                    />
                                    <Input
                                        {...register("insuranceInfo.policyNumber")}
                                        placeholder="Policy Number"
                                        className="w-1/2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="medicalHistory">Medical History (comma separated)</label>
                                <Input
                                    {...register("medicalHistory")}
                                    id="medicalHistory"
                                    placeholder="Conditions, surgeries, etc."
                                />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="allergies">Allergies (comma separated)</label>
                                <Input
                                    {...register("allergies")}
                                    id="allergies"
                                    placeholder="List of allergies"
                                />
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label>Emergency Contact</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        {...register("emergencyContact.name")}
                                        placeholder="Name"
                                    />
                                    <Input
                                        {...register("emergencyContact.relationship")}
                                        placeholder="Relationship"
                                    />
                                    <Input
                                        {...register("emergencyContact.phone")}
                                        placeholder="Phone"
                                        className="col-span-2"
                                    />
                                </div>
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
                        className={`mt-6 px-4 py-2 rounded-lg text-white w-full ${!agreedToTerms || isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </div>

            <div className="flex justify-center w-1/2 items-center">
                <img src="/docimg.png" alt="Signup Illustration" className="max-w-full h-auto" />
            </div>
        </form>
    );
};

export default Signup;