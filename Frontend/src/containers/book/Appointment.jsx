import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSlots } from "./TimeSlots"
import { format } from "date-fns"
import { AppointmentConfirmation } from "./AppointmentConfirmation"
import { useForm } from "react-hook-form"
import api from "@/api/axios"


export function Appointment({ doctor }) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState();
    const [timeSlot, setTimeSlot] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userprofileData, setUserProfileData] = useState(null);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await api.get(`/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.data.user) {
                    throw new Error("User data not found in response");
                }

                // console.log("user response data :", response.data.user);
                // console.log("user profile response data :", response.data.profile);

                setUserData(response.data.user);
                setUserProfileData(response.data.profile);

            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchUserData();
    }, []);

    const handleDateSelect = (selectedDate) => {
        console.log("Selected date:", selectedDate);
        setDate(selectedDate);
        // Reset time slot when date changes
        if (selectedDate !== date) {
            setTimeSlot(null);
        }
    };

    const handleTimeSelect = (slot) => {
        console.log("Selected time slot:", slot);
        setTimeSlot(slot); // Now receives the full slot object
    };

    const handleNext = () => {
        console.log("Proceeding to next step");
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        console.log("Going back to previous step");
        setStep((prev) => prev - 1);
    };

    const handleConfirm = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }
            console.log("user data ;", userData);
            console.log("Doctor ;", doctor);

            if (!userData?._id) throw new Error("User data not loaded");
            if (!doctor?.id) throw new Error("No doctor selected");
            if (!date) throw new Error("No date selected");
            if (!timeSlot) throw new Error("No time slot selected");

            // Populate data for appointment
            const appointmentData = {
                userId: userData._id,
                doctorId: doctor.id,
                date: format(date, "yyyy-MM-dd"),
                timeSlot: {
                    start: timeSlot.start,
                    end: timeSlot.end
                },
                reason: formData.reason
            };

            console.log("Submitting appointment:", appointmentData);

            const response = await api.post("/appointments/", appointmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Appointment created:", response.data);
            handleNext();
        } catch (error) {
            console.log("Booking failed:", error);
        }
    };

    const handleBookAnother = () => {
        console.log("Resetting form for another booking");
        setStep(1);
        setDate(undefined);
        setTimeSlot(null);
        reset();
    };

    return (
        <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                                    step === s
                                        ? "bg-teal-600 text-white"
                                        : step > s
                                            ? "bg-teal-200 text-teal-600"
                                            : "bg-gray-200 text-gray-400"
                                )}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={cn("h-1 w-10", step > s ? "bg-teal-600" : "bg-gray-200")} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Select Date and Time */}
            {step === 1 && (
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-blue-500 text-white p-4">
                        <CardTitle className="text-2xl font-bold">Select Date & Time</CardTitle>
                        <CardDescription className="text-white">Choose your preferred appointment date and time</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                            <div className="md:w-1/2">
                                <div className="space-y-1">
                                    <div className="font-medium text-gray-600">Date</div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn("w-full justify-start text-left font-normal border border-gray-300 rounded-md p-2", !date && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : "Select date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={handleDateSelect}
                                                initialFocus
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="space-y-1">
                                    <div className="font-medium text-gray-600">Time</div>
                                    <TimeSlots
                                        selectedTime={timeSlot}
                                        onSelectTime={handleTimeSelect}
                                        disabled={!date}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4">
                        <Button variant="outline" disabled className="border border-gray-300 text-gray-600 hover:bg-gray-100">
                            Back
                        </Button>
                        <Button onClick={handleNext} disabled={!date || !timeSlot} className="bg-blue-500 text-white hover:bg-blue-600">
                            Next
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 2: Patient Information */}
            {step === 2 && (
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-blue-500 text-white p-4">
                        <CardTitle className="text-2xl font-bold">Why book an Appointment ?</CardTitle>
                        <CardDescription className="text-white">Select your reason for booking.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form id="patient-form" onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Read-only fields with hidden inputs for form submission */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-600">
                                        Full Name
                                    </label>
                                    <div className="w-full border border-gray-300 rounded-md p-2 ">
                                        {userprofileData.firstName} {userprofileData.lastName}
                                    </div>
                                    <input
                                        type="hidden"
                                        {...register("name", { required: "Full name is required" })}
                                        value={`${userprofileData.firstName} ${userprofileData.lastName}`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-600">
                                        Email
                                    </label>
                                    <div className="w-full border border-gray-300 rounded-md p-2">
                                        {userData.email}
                                    </div>
                                    <input
                                        type="hidden"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        value={userData.email}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-gray-600">
                                        Phone Number
                                    </label>
                                    <div className="w-full border border-gray-300 rounded-md p-2">
                                        {userprofileData.contact}
                                    </div>
                                    <input
                                        type="hidden"
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                                                message: "Invalid phone number"
                                            }
                                        })}
                                        value={userprofileData.contact}
                                    />
                                </div>

                                {/* Editable select field */}
                                <div className="space-y-2">
                                    <label htmlFor="reason" className="text-sm font-medium text-gray-600">
                                        Reason for Visit
                                    </label>
                                    <select
                                        id="reason"
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        {...register("reason", { required: "Please select a reason" })}
                                    >
                                        <option value="" disabled>
                                            Select reason
                                        </option>
                                        <option value="consultation">Consultation</option>
                                        <option value="follow-up">Follow-up</option>
                                        <option value="check-up">Regular Check-up</option>
                                        <option value="emergency">Emergency</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.reason && (
                                        <p className="text-sm text-red-500">{errors.reason.message}</p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4">
                        <Button variant="outline" onClick={handleBack} className="border border-gray-300 text-gray-600 hover:bg-gray-100">
                            Back
                        </Button>
                        <Button type="submit" form="patient-form" className="bg-blue-500 text-white hover:bg-blue-600">
                            Confirm Booking
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <AppointmentConfirmation
                    doctor={{
                        name: doctor.name,
                        specialty: doctor.specialty
                    }}
                    date={date}
                    time={`${timeSlot.start} - ${timeSlot.end}`}
                    patientInfo={{
                        name: userprofileData.firstName + " " + userprofileData.lastName,
                        email: userData.email,
                        phone: userprofileData.contact,
                        reason: watch('reason') // From react-hook-form
                    }}
                    onBookAnother={handleBookAnother}
                />
            )}

            {/* <AppointmentCompleted  ></AppointmentCompleted> */}
        </div>
    );
}
