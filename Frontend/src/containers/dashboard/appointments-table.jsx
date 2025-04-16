import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, DollarSign, Pill, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

export function AppointmentsTable() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("today");
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);

    // Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch("/api/appointments", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data = await response.json();

                const transformedData = data.map((appointment) => {
                    const appointmentDate = new Date(appointment.date);
                    const formattedDate = appointmentDate.toLocaleDateString();
                    const time = `${appointment.timeSlot.start} - ${appointment.timeSlot.end}`;

                    let uiStatus;
                    switch (appointment.status) {
                        case "scheduled":
                            uiStatus = "Upcoming";
                            break;
                        case "completed":
                            uiStatus = "Completed";
                            break;
                        case "cancelled":
                        case "no-show":
                            uiStatus = "Cancelled";
                            break;
                        default:
                            uiStatus = appointment.status;
                    }

                    let action;
                    if (appointment.status === "scheduled") {
                        action = "Start";
                    } else {
                        action = "View";
                    }

                    return {
                        id: appointment._id,
                        patientId: appointment.patientId,
                        patientName: appointment.patientId?.firstName + " " + appointment.patientId?.lastName || "Patient Name",
                        doctorName: appointment.doctorId?.firstName + " " + appointment.doctorId?.lastName || "Doctor Name",
                        date: formattedDate,
                        time: time,
                        reason: appointment.reason,
                        status: uiStatus,
                        action: action,
                        notes: appointment.notes,
                        prescription: appointment.prescription,
                        paymentStatus: appointment.paymentStatus,
                        amount: appointment.amount,
                    };
                });

                setAppointments(transformedData);
                filterAppointments(transformedData, activeTab);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError(err.message);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Filter appointments based on the active tab
    const filterAppointments = (appointmentsData, tab) => {
        const today = new Date().toLocaleDateString();

        let filtered;
        if (tab === "today") {
            filtered = appointmentsData.filter((app) => app.date === today);
        } else if (tab === "upcoming") {
            filtered = appointmentsData.filter((app) => app.status === "Upcoming");
        } else if (tab === "completed") {
            filtered = appointmentsData.filter((app) => app.status === "Completed");
        } else if (tab === "cancelled") {
            filtered = appointmentsData.filter((app) => app.status === "Cancelled");
        } else {
            filtered = appointmentsData;
        }

        setFilteredAppointments(filtered);
    };

    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
        filterAppointments(appointments, value);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "upcoming":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 hover:bg-red-200";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
    };

    const getActionButton = (appointment) => {
        const action = appointment.action.toLowerCase();

        switch (action) {
            case "start":
                return (
                    <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleAppointmentAction(appointment)}
                    >
                        Start
                    </Button>
                );
            case "view":
                return (
                    <Button size="sm" variant="outline" onClick={() => handleAppointmentAction(appointment)}>
                        View
                    </Button>
                );
            default:
                return (
                    <Button size="sm" variant="outline" onClick={() => handleAppointmentAction(appointment)}>
                        {action}
                    </Button>
                );
        }
    };

    const handleAppointmentAction = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDialogOpen(true);
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            setIsCancelling(true);
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to cancel appointment");
            }

            // Update the local state
            setAppointments(prevAppointments =>
                prevAppointments.map(app =>
                    app.id === appointmentId ? { ...app, status: "Cancelled", action: "View" } : app
                )
            );

            // Also update filtered appointments
            setFilteredAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentId ? { ...app, status: "Cancelled", action: "View" } : app
                )
            );

            toast({
                title: "Success",
                description: "Appointment cancelled successfully",
            });

            setIsDialogOpen(false);
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message,
            });
        } finally {
            setIsCancelling(false);
        }
    };

    const handleRescheduleAppointment = async (appointmentId, newDate, newTime) => {
        try {
            setIsRescheduling(true);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            // Parse the new time
            const [startTime, endTime] = newTime.split(" - ");

            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: newDate,
                    timeSlot: {
                        end: endTime,
                        start: startTime,
                    },
                }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to reschedule appointment");
            }

            const updatedAppointment = await response.json();

            // Format the new date and time for UI
            const appointmentDate = new Date(updatedAppointment.date);
            const formattedDate = appointmentDate.toLocaleDateString();
            const time = `${updatedAppointment.timeSlot.start} - ${updatedAppointment.timeSlot.end}`;

            // Update the local state
            setAppointments(prevAppointments =>
                prevAppointments.map(app =>
                    app.id === appointmentId
                        ? {
                            ...app,
                            date: formattedDate,
                            time: time,
                        }
                        : app
                )
            );

            // Also update filtered appointments
            setFilteredAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentId
                        ? {
                            ...app,
                            date: formattedDate,
                            time: time,
                        }
                        : app
                )
            );

            toast({
                title: "Success",
                description: "Appointment rescheduled successfully",
            });

            setIsRescheduleDialogOpen(false);
        } catch (err) {
            console.error("Error rescheduling appointment:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message,
            });
        } finally {
            setIsRescheduling(false);
        }
    };

    // Get stats for the table header
    const getStats = () => {
        const today = new Date().toLocaleDateString();
        const todayAppointments = appointments.filter((app) => app.date === today);
        const upcoming = appointments.filter((app) => app.status === "Upcoming").length;
        const completed = appointments.filter((app) => app.status === "Completed").length;
        const cancelled = appointments.filter((app) => app.status === "Cancelled").length;

        return {
            today: todayAppointments.length,
            upcoming,
            completed,
            cancelled,
        };
    };

    const stats = getStats();

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Today's Appointments</h2>
                <div className="flex space-x-2">
                    {loading ? (
                        <Skeleton className="h-8 w-32" />
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            {activeTab === "today" && `${stats.today} appointments today`}
                            {activeTab === "upcoming" && `${stats.upcoming} upcoming appointments`}
                            {activeTab === "completed" && `${stats.completed} completed appointments`}
                            {activeTab === "cancelled" && `${stats.cancelled} cancelled appointments`}
                        </div>
                    )}
                </div>
            </div>

            <Tabs defaultValue="today" onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="w-full">
                    {renderAppointmentsTable()}
                </TabsContent>
                <TabsContent value="upcoming" className="w-full">
                    {renderAppointmentsTable()}
                </TabsContent>
                <TabsContent value="completed" className="w-full">
                    {renderAppointmentsTable()}
                </TabsContent>
                <TabsContent value="cancelled" className="w-full">
                    {renderAppointmentsTable()}
                </TabsContent>
            </Tabs>

            {/* Appointment Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedAppointment && (
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Appointment Details</DialogTitle>
                            <DialogDescription>View complete information about this appointment</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                        {selectedAppointment.patientName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedAppointment.patientName}</h3>
                                </div>
                                <Badge variant="secondary" className={`ml-auto ${getStatusClass(selectedAppointment.status)}`}>
                                    {selectedAppointment.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedAppointment.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedAppointment.time}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Reason</span>
                                </div>
                                <p className="text-sm pl-6">{selectedAppointment.reason}</p>
                            </div>

                            {selectedAppointment.notes && (
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Notes</span>
                                    </div>
                                    <p className="text-sm pl-6">{selectedAppointment.notes}</p>
                                </div>
                            )}

                            {selectedAppointment.prescription &&
                                selectedAppointment.prescription.medications &&
                                selectedAppointment.prescription.medications.length > 0 && (
                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Pill className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Prescription</span>
                                        </div>
                                        <div className="pl-6">
                                            {selectedAppointment.prescription.medications.map((med, index) => (
                                                <div key={index} className="text-sm mb-1">
                                                    <span className="font-medium">{med.name}</span>: {med.dosage}, {med.frequency}, {med.duration}
                                                </div>
                                            ))}
                                            {selectedAppointment.prescription.instructions && (
                                                <p className="text-sm mt-2">
                                                    <span className="font-medium">Instructions:</span>{" "}
                                                    {selectedAppointment.prescription.instructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {selectedAppointment.paymentStatus && (
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Payment</span>
                                    </div>
                                    <div className="pl-6 flex items-center justify-between">
                                        <span className="text-sm">Status: {selectedAppointment.paymentStatus}</span>
                                        {selectedAppointment.amount && (
                                            <span className="text-sm font-medium">${selectedAppointment.amount.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex gap-2">
                            {selectedAppointment.status === "Upcoming" && (
                                <>
                                    <Button
                                        variant="outline"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : "Cancel Appointment"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            setIsRescheduleDialogOpen(true);
                                        }}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button className="bg-blue-500 hover:bg-blue-600">
                                        Start Appointment
                                    </Button>
                                </>
                            )}
                            {selectedAppointment.status === "Completed" && (
                                <Button>View Medical Record</Button>
                            )}
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                        <DialogDescription>
                            Select a new date and time for this appointment
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-1">
                                New Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                className="w-full p-2 border rounded"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium mb-1">
                                New Time Slot
                            </label>
                            <select
                                id="time"
                                className="w-full p-2 border rounded"
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                            >
                                <option value="">Select a time slot</option>
                                <option value="09:00 - 09:30">09:00 - 09:30</option>
                                <option value="09:30 - 10:00">09:30 - 10:00</option>
                                <option value="10:00 - 10:30">10:00 - 10:30</option>
                                <option value="10:30 - 11:00">10:30 - 11:00</option>
                                <option value="11:00 - 11:30">11:00 - 11:30</option>
                                <option value="11:30 - 12:00">11:30 - 12:00</option>
                                <option value="12:00 - 12:30">12:00 - 12:30</option>
                                <option value="12:30 - 13:00">12:30 - 13:00</option>
                                <option value="13:00 - 13:30">13:00 - 13:30</option>
                                <option value="13:30 - 14:00">13:30 - 14:00</option>
                                <option value="14:00 - 14:30">14:00 - 14:30</option>
                                <option value="14:30 - 15:00">14:30 - 15:00</option>
                                <option value="15:00 - 15:30">15:00 - 15:30</option>
                                <option value="15:30 - 16:00">15:30 - 16:00</option>
                                <option value="16:00 - 16:30">16:00 - 16:30</option>
                                <option value="16:30 - 17:00">16:30 - 17:00</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRescheduleDialogOpen(false);
                                setRescheduleDate("");
                                setRescheduleTime("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedAppointment && rescheduleDate && rescheduleTime) {
                                    handleRescheduleAppointment(
                                        selectedAppointment.id,
                                        rescheduleDate,
                                        rescheduleTime
                                    );
                                    setRescheduleDate("");
                                    setRescheduleTime("");
                                }
                            }}
                            disabled={!rescheduleDate || !rescheduleTime || isRescheduling}
                        >
                            {isRescheduling ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Rescheduling...
                                </>
                            ) : "Confirm Reschedule"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );

    // Helper function to render the appointments table
    function renderAppointmentsTable() {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading appointments...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8 text-red-500">
                    <p>Error: {error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            );
        }

        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No appointments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id} className="hover:bg-muted/50">
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {appointment.patientName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{appointment.patientName}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>{appointment.date}</TableCell>
                                    <TableCell>{appointment.time}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px] truncate" title={appointment.reason}>
                                            {appointment.reason}
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {appointment.doctorName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{appointment.doctorName}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusClass(appointment.status)}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex gap-2 justify-end">
                                        {getActionButton(appointment)}
                                        {appointment.status === "Upcoming" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setSelectedAppointment(appointment);
                                                        setIsRescheduleDialogOpen(true);
                                                        setRescheduleDate("");
                                                        setRescheduleTime("");
                                                    }}
                                                >
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    disabled={isCancelling}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
