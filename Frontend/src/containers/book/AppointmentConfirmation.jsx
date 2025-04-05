import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Check, Calendar, Clock, User, Mail, Phone, FileText } from "lucide-react"

export function AppointmentConfirmation({ doctor, date, time, patientInfo, onBookAnother }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
        <CardDescription>Your appointment has been successfully scheduled</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Appointment Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Doctor: {doctor.name} ({doctor.specialty})
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Date: {format(date, "PPPP")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Time: {time}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">Patient Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Name: {patientInfo.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email: {patientInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Phone: {patientInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Reason: {patientInfo.reason}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-semibold">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your email address. Please arrive 15 minutes before your appointment
              time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onBookAnother}>Book Another Appointment</Button>
      </CardFooter>
    </Card>
  )
}

