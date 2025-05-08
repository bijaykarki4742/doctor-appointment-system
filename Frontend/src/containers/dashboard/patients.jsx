"use client"

import { Search, Eye, Trash, UserPlus, Filter, X } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

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
        const response = await fetch("/api/users/getAllpatients")
        if (!response.ok) {
          throw new Error("Failed to fetch patients")
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
  }, [toast])

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
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete patient")
      }

      // Update the patients list
      setPatients(patients.filter((patient) => patient._id !== patientToDelete._id))

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
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient._id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && patient.status === "active") ||
      (statusFilter === "inactive" && patient.status === "inactive")

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Patients</h1>
          <p className="text-gray-500">Manage and view patient information</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 transition-colors w-full md:w-auto">
          <UserPlus className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </div>

      <Card className="mb-8 border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name or ID..."
                className="pl-10 w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full border-gray-200 focus:ring-emerald-500">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          <Card className="border-none shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[100px] font-semibold">Patient ID</TableHead>
                    <TableHead className="font-semibold">Full Name</TableHead>
                    <TableHead className="font-semibold">Age</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-gray-300 mb-2" />
                          <p>No patients found</p>
                          <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-700">
                          #{patient._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-gray-200">
                              <AvatarImage src={patient.image || "/placeholder.svg"} alt={patient.name} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-800">
                                {patient.name?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{patient.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              patient.status === "active"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0"
                                : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                            }
                          >
                            {patient.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
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
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
          </Card>

          {/* Enhanced View Patient Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            {selectedPatient && (
              <DialogContent className="max-w-[90vw] w-full max-h-[90vh] h-full md:h-auto md:max-h-[800px] p-0 overflow-hidden rounded-lg">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-gray-100"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                  
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <Avatar className="h-20 w-20 border-4 border-white/20">
                        <AvatarImage
                          src={selectedPatient.profilePicture || "/placeholder.svg"}
                          alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                        />
                        <AvatarFallback className="bg-white text-emerald-800 text-2xl font-medium">
                          {selectedPatient.firstName?.charAt(0)?.toUpperCase()}
                          {selectedPatient.lastName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                            ID: #{selectedPatient._id.slice(-6).toUpperCase()}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              selectedPatient.status === "active"
                                ? "bg-emerald-100/20 hover:bg-emerald-100/30 border-0"
                                : "bg-red-100/20 hover:bg-red-100/30 border-0"
                            }
                          >
                            {selectedPatient.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="basic" className="w-full">
                    <div className="border-b bg-gray-50 px-6">
                      <TabsList className="bg-transparent border-b-0 p-0 w-full justify-start">
                        <TabsTrigger
                          value="basic"
                          className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-700 rounded-none py-3 px-4"
                        >
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="medical"
                          className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-700 rounded-none py-3 px-4"
                        >
                          Medical History
                        </TabsTrigger>
                        <TabsTrigger
                          value="contact"
                          className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-700 rounded-none py-3 px-4"
                        >
                          Contact Info
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <ScrollArea className="h-[calc(80vh-180px)] md:h-[500px] w-full">
                      <TabsContent value="basic" className="p-6 pt-4 space-y-6 m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Personal Information</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-500">Date of Birth</p>
                                  <p className="font-medium">
                                    {selectedPatient.dateOfBirth
                                      ? new Date(selectedPatient.dateOfBirth).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Age</p>
                                  <p className="font-medium">{selectedPatient.age || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Gender</p>
                                  <p className="font-medium">{selectedPatient.gender || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Blood Type</p>
                                  <p className="font-medium">{selectedPatient.bloodType || "N/A"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Contact Details</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">{selectedPatient.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{selectedPatient.email || "N/A"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {selectedPatient.notes && (
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg text-gray-800 mb-3">Additional Notes</h3>
                              <p className="text-gray-700 whitespace-pre-line">
                                {selectedPatient.notes || "No additional notes available"}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="medical" className="p-6 pt-4 space-y-6 m-0">
                        <Card className="border border-gray-200 shadow-none">
                          <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Medical Conditions</h3>
                            {selectedPatient.medicalHistory?.length > 0 ? (
                              <div className="space-y-4">
                                {selectedPatient.medicalHistory.map((history, index) => (
                                  <div key={index} className="border-l-4 border-emerald-500 pl-4 py-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{history.condition}</p>
                                        {history.diagnosisDate && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Diagnosed: {new Date(history.diagnosisDate).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                      {history.severity && (
                                        <Badge
                                          variant="outline"
                                          className={
                                            history.severity === "High"
                                              ? "bg-red-50 text-red-700 border-red-200"
                                              : history.severity === "Medium"
                                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                              : "bg-green-50 text-green-700 border-green-200"
                                          }
                                        >
                                          {history.severity}
                                        </Badge>
                                      )}
                                    </div>
                                    {history.treatment && (
                                      <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Treatment</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line">
                                          {history.treatment}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No medical conditions recorded</p>
                            )}
                          </CardContent>
                        </Card>

                        {selectedPatient.allergies?.length > 0 && (
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Allergies</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedPatient.allergies.map((allergy, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
                                  >
                                    {allergy}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <Card className="border border-gray-200 shadow-none">
                          <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold text-lg text-gray-800">Medications</h3>
                            {selectedPatient.medications?.length > 0 ? (
                              <div className="space-y-3">
                                {selectedPatient.medications.map((med, index) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-emerald-600"
                                      >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="font-medium">{med.name}</p>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                          Dosage: {med.dosage || "N/A"}
                                        </span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                          Frequency: {med.frequency || "N/A"}
                                        </span>
                                        {med.startDate && (
                                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            Since: {new Date(med.startDate).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No medications recorded</p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="contact" className="p-6 pt-4 space-y-6 m-0">
                        {selectedPatient.address && (
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Address</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Street</p>
                                  <p className="font-medium">{selectedPatient.address.street || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">City</p>
                                  <p className="font-medium">{selectedPatient.address.city || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">State/Province</p>
                                  <p className="font-medium">{selectedPatient.address.state || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Postal Code</p>
                                  <p className="font-medium">{selectedPatient.address.postalCode || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Country</p>
                                  <p className="font-medium">{selectedPatient.address.country || "N/A"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {selectedPatient.insuranceInfo && (
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Insurance Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Provider</p>
                                  <p className="font-medium">{selectedPatient.insuranceInfo.provider || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Policy Number</p>
                                  <p className="font-medium">{selectedPatient.insuranceInfo.policyNumber || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Group Number</p>
                                  <p className="font-medium">{selectedPatient.insuranceInfo.groupNumber || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Expiration Date</p>
                                  <p className="font-medium">
                                    {selectedPatient.insuranceInfo.expirationDate
                                      ? new Date(selectedPatient.insuranceInfo.expirationDate).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {selectedPatient.emergencyContact && (
                          <Card className="border border-gray-200 shadow-none">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-semibold text-lg text-gray-800">Emergency Contact</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Name</p>
                                  <p className="font-medium">{selectedPatient.emergencyContact.name || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Relationship</p>
                                  <p className="font-medium">
                                    {selectedPatient.emergencyContact.relationship || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">{selectedPatient.emergencyContact.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{selectedPatient.emergencyContact.email || "N/A"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </div>
              </DialogContent>
            )}
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
                <DialogDescription className="pt-2">
                  Are you sure you want to delete {patientToDelete?.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
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