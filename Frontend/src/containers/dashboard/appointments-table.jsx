import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppointmentsTable({ appointments }) {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "text-blue-500"
      case "completed":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getActionButton = (action) => {
    switch (action.toLowerCase()) {
      case "start":
        return (
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            Start
          </Button>
        )
      case "view":
        return (
          <Button size="sm" variant="outline">
            View
          </Button>
        )
      default:
        return (
          <Button size="sm" variant="outline">
            {action}
          </Button>
        )
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Today's Appointments</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-blue-500">
            Daily
          </Button>
          <Button variant="ghost" size="sm">
            Weekly
          </Button>
          <Button variant="ghost" size="sm">
            Monthly
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={appointment.patientImage} alt={appointment.patientName} />
                    <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {appointment.patientName}
                </TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <span className={getStatusClass(appointment.status)}>{appointment.status}</span>
                </TableCell>
                <TableCell>{getActionButton(appointment.action)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

