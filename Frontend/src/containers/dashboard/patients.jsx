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

export default function PatientsPage() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [patientToDelete, setPatientToDelete] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const { toast } = useToast()

    // Fetch patients data
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/users/getAllpatients')
                if (!response.ok) {
                    throw new Error('Failed to fetch patients')
                }
                const data = await response.json()
                setPatients(data.allPatients)
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

        fetchPatients()
    }, [])

    // Handle delete confirmation
    const confirmDelete = (patient) => {
        setPatientToDelete(patient)
        setIsDeleteDialogOpen(true)
    }

    // Handle actual deletion
    const handleDelete = async () => {
        if (!patientToDelete) return

        try {
            const response = await fetch(`/api/users/delete/${patientToDelete._id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete patient')
            }

            // Update the patients list
            setPatients(patients.filter(patient => patient._id !== patientToDelete._id))

            toast({
                title: "Success",
                description: "Patient deleted successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsDeleteDialogOpen(false)
            setPatientToDelete(null)
        }
    }

    // Filter patients based on search and status
    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient._id?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && patient.status === "active") ||
            (statusFilter === "inactive" && patient.status === "inactive")

        return matchesSearch && matchesStatus
    })

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Patients</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search patients by name or ID..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                                    <TableHead className="w-[100px]">Patient ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No patients found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <TableRow key={patient._id}>
                                            <TableCell className="font-medium">#{patient._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                        {patient.image ? (
                                                            <img
                                                                src={patient.image}
                                                                alt={patient.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-medium">
                                {patient.name?.charAt(0)?.toUpperCase()}
                              </span>
                                                        )}
                                                    </div>
                                                    <span>{patient.firstName + " " + patient.lastName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{patient.age}</TableCell>
                                            <TableCell>{patient.gender}</TableCell>
                                            <TableCell>{patient.contact}</TableCell>
                                            <TableCell>
                                                <Badge className={patient.status === 'active' ?
                                                    "bg-green-100 text-green-800 hover:bg-green-100" :
                                                    "bg-red-100 text-red-800 hover:bg-red-100"}>
                                                    {patient.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600"
                                                        onClick={() => {
                                                            setSelectedPatient(patient)
                                                            setIsViewDialogOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600"
                                                        onClick={() => confirmDelete(patient)}
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

                    {/* View Patient Dialog */}
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        {selectedPatient && (
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Patient Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {selectedPatient.profilePicture ? (
                                                <img
                                                    src={selectedPatient.profilePicture}
                                                    alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-xl font-medium">
                {selectedPatient.firstName?.charAt(0)?.toUpperCase()}
              </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {selectedPatient.firstName} {selectedPatient.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">ID: #{selectedPatient._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Age</p>
                                            <p>{selectedPatient.age}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p>{selectedPatient.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contact</p>
                                            <p>{selectedPatient.contact}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date of Birth</p>
                                            <p>{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {selectedPatient.address && (
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">Street</p>
                                                    <p className="text-sm">{selectedPatient.address.street || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">City</p>
                                                    <p className="text-sm">{selectedPatient.address.city || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">State</p>
                                                    <p className="text-sm">{selectedPatient.address.state || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Postal Code</p>
                                                    <p className="text-sm">{selectedPatient.address.postalCode || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Country</p>
                                                    <p className="text-sm">{selectedPatient.address.country || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatient.insuranceInfo && (
                                        <div>
                                            <p className="text-sm text-gray-500">Insurance Information</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">Provider</p>
                                                    <p className="text-sm">{selectedPatient.insuranceInfo.provider || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Policy Number</p>
                                                    <p className="text-sm">{selectedPatient.insuranceInfo.policyNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatient.medicalHistory?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Medical History</p>
                                            <div className="space-y-2">
                                                {selectedPatient.medicalHistory.map((history, index) => (
                                                    <div key={index} className="border rounded p-2">
                                                        <p className="text-sm font-medium">{history.condition}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Diagnosed: {history.diagnosisDate ? new Date(history.diagnosisDate).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                        <p className="text-xs">{history.treatment || 'No treatment specified'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatient.allergies?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-500">Allergies</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedPatient.allergies.map((allergy, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {allergy}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatient.emergencyContact && (
                                        <div>
                                            <p className="text-sm text-gray-500">Emergency Contact</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">Name</p>
                                                    <p className="text-sm">{selectedPatient.emergencyContact.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Relationship</p>
                                                    <p className="text-sm">{selectedPatient.emergencyContact.relationship || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Phone</p>
                                                    <p className="text-sm">{selectedPatient.emergencyContact.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                    Are you sure you want to delete {patientToDelete?.name}? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete Patient
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    )
}
