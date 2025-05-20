"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, VideoIcon } from "lucide-react";

export default function UpcomingAppointment({ appointment }) {
    return (
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-500 text-white p-4">
                <CardTitle className="text-2xl font-bold">Upcoming Appointment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-blue-500">
                        <AvatarFallback>{appointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-medium text-lg">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-gray-600">
                            {appointment.date}, {appointment.time}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="bg-white text-blue-500 hover:bg-blue-100">
                            <CalendarIcon className="h-4 w-4 mr-2" /> Reschedule
                        </Button>
                        <Button className="bg-blue-500 text-white hover:bg-blue-600">
                            <VideoIcon className="h-4 w-4 mr-2" /> Join Video Call
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
