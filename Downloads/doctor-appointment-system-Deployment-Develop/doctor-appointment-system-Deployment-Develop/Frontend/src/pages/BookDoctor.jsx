import { Appointment } from '@/containers/book/Appointment'
import { Star, MapPin } from "lucide-react"
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Navbar from '@/containers/Navbar'

const BookDoctor = () => {

    const location = useLocation();
    const { doctor } = location.state || {};

    useEffect(() => {
        if (location.state?.doctor) {
            console.log("Doctor ID:", location.state.doctor.id);
        }
    }, [location.state]);

    if (!doctor) {
        return (
            <main className="container px-4 py-6 md:px-6 md:py-12 lg:py-16">
                <div className="mx-auto max-w-4xl space-y-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        No Doctor Selected
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Please go back and select a doctor to book an appointment.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <>
            <Navbar></Navbar>
            <main className="container px-4 py-6 md:px-6 md:py-12 lg:py-16">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Book Your Doctor Appointment
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Schedule an appointment with our experienced doctors in just a few clicks.
                        </p>
                    </div>

                    {/* Doctor Information Card - Added right after description */}
                    <div className="mx-auto max-w-2xl">
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={doctor.profilePicture || "/default-doctor.png"}
                                            alt={`${doctor.firstName} ${doctor.lastName}`}
                                        />
                                        <AvatarFallback>
                                            {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold">
                                            Dr. {doctor.name}
                                        </h2>
                                        <p className="text-blue-600">
                                            {doctor.specialty || "General Practitioner"}
                                        </p>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{doctor.rating}</span>
                                            <span className="text-muted-foreground">(1.2k reviews)</span>
                                        </div>
                                        {doctor.hospitalAffiliation?.length > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{doctor.hospitalAffiliation[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <Appointment doctor={doctor} />
                </div>
            </main>
        </>
    )

}

export default BookDoctor
