import { Search, Eye, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [doctorToDelete, setDoctorToDelete] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [specializationFilter, setSpecializationFilter] = useState("all")
    const { toast } = useToast()

    // Fetch doctors data
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/v1/api/doctors/get" ,{
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch doctors")
                }
                const data = await response.json()
                setDoctors(data.allDoctors)
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchDoctors()
    }, [])

    // Handle delete confirmation
    const confirmDelete = (doctor) => {
        setDoctorToDelete(doctor)
        setIsDeleteDialogOpen(true)
    }

    // Handle actual deletion
    const handleDelete = async () => {
        if (!doctorToDelete) return

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/v1/api/doctors/delete/${doctorToDelete._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) {
                throw new Error("Failed to delete doctor")
            }

            // Update the doctors list
            setDoctors(doctors.filter((doctor) => doctor._id !== doctorToDelete._id))

            toast({
                title: "Success",
                description: "Doctor deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsDeleteDialogOpen(false)
            setDoctorToDelete(null)
        }
    }

    // Filter doctors based on search and specialization
    const filteredDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            doctor._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter

        return matchesSearch && matchesSpecialization
    })

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search doctors by name or license number..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Specializations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Specializations</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                            <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Doctor ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Specialization</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredDoctors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No doctors found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredDoctors.map((doctor) => (
                                        <TableRow key={doctor._id}>
                                            <TableCell className="font-medium">#{doctor._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                        {doctor.profilePicture ? (
                                                            <img
                                                                src={doctor.profilePicture || "/placeholder.svg"}
                                                                alt={`${doctor.firstName} ${doctor.lastName}`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-medium">{doctor.firstName?.charAt(0)?.toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <span>
                            {doctor.firstName} {doctor.lastName}
                          </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{doctor.specialization}</TableCell>
                                            <TableCell>{doctor.experience} years</TableCell>
                                            <TableCell>{doctor.contact}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        doctor.isVerified
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                    }
                                                >
                                                    {doctor.isVerified ? "Verified" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600"
                                                        onClick={() => {
                                                            setSelectedDoctor(doctor)
                                                            setIsViewDialogOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600"
                                                        onClick={() => confirmDelete(doctor)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* View Doctor Dialog */}
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        {selectedDoctor && (
                            <DialogContent className="max-w-md md:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Doctor Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {selectedDoctor.profilePicture ? (
                                                <img
                                                    src={selectedDoctor.profilePicture || "/placeholder.svg"}
                                                    alt={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-xl font-medium">
                          {selectedDoctor.firstName?.charAt(0)?.toUpperCase()}
                        </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">License: {selectedDoctor.licenseNumber}</p>
                                            <Badge
                                                className={
                                                    selectedDoctor.isVerified
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                }
                                            >
                                                {selectedDoctor.isVerified ? "Verified" : "Pending Verification"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Specialization</p>
                                            <p className="font-medium">{selectedDoctor.specialization}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p>{selectedDoctor.experience} years</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Age</p>
                                            <p>{selectedDoctor.age}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="capitalize">{selectedDoctor.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contact</p>
                                            <p>{selectedDoctor.contact}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Consultation Fee</p>
                                            <p>${selectedDoctor.consultationFee}</p>
                                        </div>
                                    </div>

                                    {selectedDoctor.bio && (
                                        <div>
                                            <p className="text-sm text-gray-500">Bio</p>
                                            <p className="text-sm">{selectedDoctor.bio}</p>
                                        </div>
                                    )}

                                    {selectedDoctor.qualifications?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Qualifications</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedDoctor.qualifications.map((qualification, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {qualification}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDoctor.hospitalAffiliation?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Hospital Affiliations</p>
                                            <div className="space-y-1">
                                                {selectedDoctor.hospitalAffiliation.map((hospital, index) => (
                                                    <p key={index} className="text-sm">
                                                        • {hospital}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedDoctor.languagesSpoken?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Languages Spoken</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedDoctor.languagesSpoken.map((language, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500">Joined On</p>
                                        <p className="text-sm">{new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </DialogContent>
                        )}
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete Dr. {doctorToDelete?.firstName} {doctorToDelete?.lastName}? This
                                    action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Delete Doctor
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    )
}
