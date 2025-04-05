import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UpcomingAppointment({ appointment }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Appointment</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-blue-500">
                        <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-medium">{appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        <p className="text-sm">
                            {appointment.date}, {appointment.time}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Reschedule</Button>
                        <Button>Join Video Call</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

