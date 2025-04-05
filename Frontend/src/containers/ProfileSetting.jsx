// "use client"
//
// import { useEffect, useState } from "react"
// import { format } from "date-fns"
// import { CalendarIcon, Camera, Settings } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { cn } from "@/components/lib/utils"
// import { toast } from "@/components/ui/use-toast"
// import api from "@/api/axios.js"
//
// // Sample data for patient (we'll only use this if userType is patient)
// const samplePatient = {
//     firstName: "Sarah",
//     lastName: "Johnson",
//     email: "sarah.johnson@example.com",
//     contact: "5551234567",
//     dateOfBirth: new Date(2000, 0, 1),
//     gender: "female",
//     address: {
//         street: "123 Main St",
//         city: "San Francisco",
//         state: "CA",
//         postalCode: "94105",
//         country: "USA",
//     },
//     insuranceInfo: {
//         provider: "Health Plus",
//         policyNumber: "HP12345678",
//     },
//     medicalHistory: [
//         {
//             condition: "Asthma",
//             diagnosisDate: new Date(2010, 5, 15),
//             treatment: "Inhaler as needed",
//         },
//     ],
//     allergies: ["Peanuts", "Penicillin"],
//     emergencyContact: {
//         name: "John Johnson",
//         relationship: "Father",
//         phone: "5559876543",
//     },
//     profilePicture: "/placeholder.svg?height=200&width=200",
// }
//
// const sampleAppointment = {
//     doctorName: "Dr. Michael Smith",
//     specialty: "General Physician",
//     date: "Tomorrow",
//     time: "10:00 AM",
// }
//
// export default function ProfileSetting({
//                                             userType = "doctor",
//                                             initialData = userType === "patient" ? samplePatient : null,
//                                         }) {
//     const [isEditing, setIsEditing] = useState(false)
//     const [data, setData] = useState(initialData)
//     const [date, setDate] = useState(userType === "patient" ? initialData?.dateOfBirth : undefined)
//     const [loading, setLoading] = useState(true)
//     const [saving, setSaving] = useState(false)
//     const [error, setError] = useState("")
//
//     // Fetch doctor data on component mount
//     useEffect(() => {
//         if (userType === "doctor") {
//             fetchDoctorData()
//         } else {
//             setLoading(false)
//         }
//     }, [userType])
//
//     const fetchDoctorData = async () => {
//         try {
//             setLoading(true)
//             const token = localStorage.getItem("token")
//             if (!token) {
//                 throw new Error("No authentication token found")
//             }
//
//             const response = await api.get(`/doctors/me`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             })
//
//             if (!response.data.doctor) {
//                 throw new Error("Doctor data not found in response")
//             }
//
//             // Format the doctor data to match our component's expected structure
//             const doctorData = response.data.doctor
//             setData({
//                 firstName: doctorData.firstName || "",
//                 lastName: doctorData.lastName || "",
//                 email: "", // API doesn't return email, so we'll leave it blank
//                 contact: doctorData.contact || "",
//                 specialization: doctorData.specialization || "None",
//                 licenseNumber: doctorData.licenseNumber || "",
//                 gender: doctorData.gender || "male",
//                 qualifications: doctorData.qualifications || [],
//                 hospitalAffiliation: doctorData.hospitalAffiliation || [],
//                 experience: doctorData.experience || 0,
//                 bio: doctorData.bio || "",
//                 languagesSpoken: doctorData.languagesSpoken || [],
//                 consultationFee: doctorData.consultationFee || 0,
//                 profilePicture: doctorData.profilePicture || "/placeholder.svg?height=200&width=200",
//                 isVerified: doctorData.isVerified || false,
//             })
//
//             setError("")
//         } catch (error) {
//             setError(error.message || "Failed to fetch doctor profile")
//             console.error("Failed to fetch profile", error)
//             toast({
//                 title: "Error",
//                 description: "Failed to load profile data. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     const updateDoctorProfile = async () => {
//         try {
//             setSaving(true)
//             const token = localStorage.getItem("token")
//             if (!token) {
//                 throw new Error("No authentication token found")
//             }
//
//             // Prepare the data for the API
//             const updateData = {
//                 firstName: data.firstName,
//                 lastName: data.lastName,
//                 contact: data.contact,
//                 specialization: data.specialization,
//                 licenseNumber: data.licenseNumber,
//                 gender: data.gender,
//                 qualifications: data.qualifications,
//                 hospitalAffiliation: data.hospitalAffiliation,
//                 experience: Number(data.experience),
//                 bio: data.bio,
//                 languagesSpoken: data.languagesSpoken,
//                 consultationFee: Number(data.consultationFee),
//             }
//
//             // Send the update request
//             const response = await api.put(`/doctors/me`, updateData, {
//                 headers: { Authorization: `Bearer ${token}` },
//             })
//
//             if (response.data.success) {
//                 toast({
//                     title: "Success",
//                     description: "Profile updated successfully",
//                 })
//                 // Refresh the doctor data
//                 await fetchDoctorData()
//             } else {
//                 throw new Error(response.data.message || "Failed to update profile")
//             }
//         } catch (error) {
//             console.error("Failed to update profile", error)
//             toast({
//                 title: "Error",
//                 description: error.message || "Failed to update profile. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setSaving(false)
//             setIsEditing(false)
//         }
//     }
//
//     const toggleEditMode = () => {
//         setIsEditing(!isEditing)
//     }
//
//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setData({ ...data, [name]: value })
//     }
//
//     const handleSelectChange = (name, value) => {
//         setData({ ...data, [name]: value })
//     }
//
//     const handleDateChange = (date) => {
//         setDate(date)
//         if (userType === "patient" && date) {
//             setData({ ...data, dateOfBirth: date })
//         }
//     }
//
//     const handleSave = () => {
//         if (userType === "doctor") {
//             updateDoctorProfile()
//         } else {
//             // Handle patient profile update if needed
//             console.log("Saving patient data:", data)
//             setIsEditing(false)
//         }
//     }
//
//     if (loading) {
//         return (
//             <div className="container mx-auto py-6 max-w-4xl">
//                 <div className="flex justify-center items-center h-64">
//                     <div className="text-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
//                         <p className="text-lg">Loading profile data...</p>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
//
//     if (error && !data) {
//         return (
//             <div className="container mx-auto py-6 max-w-4xl">
//                 <div className="bg-destructive/10 p-6 rounded-lg text-center">
//                     <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Profile</h2>
//                     <p className="mb-4">{error}</p>
//                     <Button onClick={fetchDoctorData}>Try Again</Button>
//                 </div>
//             </div>
//         )
//     }
//
//     return (
//         <div className="container mx-auto py-6 max-w-4xl">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold">Profile Settings</h1>
//                 <Button variant="ghost" size="icon">
//                     <Settings className="h-5 w-5" />
//                 </Button>
//             </div>
//
//             {/* Profile Header */}
//             <Card className="mb-6">
//                 <CardContent className="pt-6">
//                     <div className="flex flex-col sm:flex-row items-center gap-6">
//                         <div className="relative">
//                             <Avatar className="h-24 w-24">
//                                 <AvatarImage
//                                     src={data.profilePicture || "/placeholder.svg?height=200&width=200"}
//                                     alt={`${data.firstName} ${data.lastName}`}
//                                 />
//                                 <AvatarFallback>
//                                     {data.firstName?.charAt(0) || ""}
//                                     {data.lastName?.charAt(0) || ""}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
//                                 <Camera className="h-4 w-4" />
//                             </Button>
//                         </div>
//                         <div>
//                             <h2 className="text-xl font-semibold">
//                                 {data.firstName} {data.lastName}
//                             </h2>
//                             {userType === "doctor" && data.isVerified && (
//                                 <p className="text-sm text-green-600 flex items-center gap-1">
//                                     <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
//                                     Verified Doctor
//                                 </p>
//                             )}
//                             {userType === "patient" && data.dateOfBirth && (
//                                 <p className="text-muted-foreground">
//                                     Age: {new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()}
//                                 </p>
//                             )}
//                         </div>
//                         <div className="ml-auto">
//                             <Button onClick={toggleEditMode}>{isEditing ? "View Profile" : "Edit Profile"}</Button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//
//             {/* Personal Information */}
//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>Personal Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="firstName">First Name</Label>
//                             {isEditing ? (
//                                 <Input id="firstName" name="firstName" value={data.firstName} onChange={handleChange} />
//                             ) : (
//                                 <p className="p-2 border rounded-md">{data.firstName}</p>
//                             )}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="lastName">Last Name</Label>
//                             {isEditing ? (
//                                 <Input id="lastName" name="lastName" value={data.lastName} onChange={handleChange} />
//                             ) : (
//                                 <p className="p-2 border rounded-md">{data.lastName}</p>
//                             )}
//                         </div>
//                     </div>
//
//                     {data.email !== undefined && (
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email Address</Label>
//                             {isEditing ? (
//                                 <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} />
//                             ) : (
//                                 <p className="p-2 border rounded-md">{data.email}</p>
//                             )}
//                         </div>
//                     )}
//
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="contact">Phone Number</Label>
//                             {isEditing ? (
//                                 <Input id="contact" name="contact" value={data.contact} onChange={handleChange} />
//                             ) : (
//                                 <p className="p-2 border rounded-md">{data.contact}</p>
//                             )}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="gender">Gender</Label>
//                             {isEditing ? (
//                                 <Select value={data.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
//                                     <SelectTrigger id="gender">
//                                         <SelectValue placeholder="Select gender" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="male">Male</SelectItem>
//                                         <SelectItem value="female">Female</SelectItem>
//                                         <SelectItem value="other">Other</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             ) : (
//                                 <p className="p-2 border rounded-md capitalize">{data.gender}</p>
//                             )}
//                         </div>
//                     </div>
//
//                     {userType === "patient" && data.dateOfBirth && (
//                         <>
//                             <div className="space-y-2">
//                                 <Label htmlFor="dateOfBirth">Date of Birth</Label>
//                                 {isEditing ? (
//                                     <Popover>
//                                         <PopoverTrigger asChild>
//                                             <Button
//                                                 variant={"outline"}
//                                                 className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//                                             >
//                                                 <CalendarIcon className="mr-2 h-4 w-4" />
//                                                 {date ? format(date, "PPP") : <span>Pick a date</span>}
//                                             </Button>
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-auto p-0">
//                                             <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
//                                         </PopoverContent>
//                                     </Popover>
//                                 ) : (
//                                     <p className="p-2 border rounded-md">
//                                         {data.dateOfBirth ? format(new Date(data.dateOfBirth), "PPP") : "Not specified"}
//                                     </p>
//                                 )}
//                             </div>
//
//                             {data.address && (
//                                 <div className="space-y-2">
//                                     <Label>Address</Label>
//                                     {isEditing ? (
//                                         <div className="grid gap-2">
//                                             <Input
//                                                 placeholder="Street"
//                                                 name="street"
//                                                 value={data.address.street}
//                                                 onChange={(e) => {
//                                                     const updatedAddress = { ...data.address, street: e.target.value }
//                                                     setData({ ...data, address: updatedAddress })
//                                                 }}
//                                             />
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <Input
//                                                     placeholder="City"
//                                                     name="city"
//                                                     value={data.address.city}
//                                                     onChange={(e) => {
//                                                         const updatedAddress = { ...data.address, city: e.target.value }
//                                                         setData({ ...data, address: updatedAddress })
//                                                     }}
//                                                 />
//                                                 <Input
//                                                     placeholder="State"
//                                                     name="state"
//                                                     value={data.address.state}
//                                                     onChange={(e) => {
//                                                         const updatedAddress = { ...data.address, state: e.target.value }
//                                                         setData({ ...data, address: updatedAddress })
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <Input
//                                                     placeholder="Postal Code"
//                                                     name="postalCode"
//                                                     value={data.address.postalCode}
//                                                     onChange={(e) => {
//                                                         const updatedAddress = { ...data.address, postalCode: e.target.value }
//                                                         setData({ ...data, address: updatedAddress })
//                                                     }}
//                                                 />
//                                                 <Input
//                                                     placeholder="Country"
//                                                     name="country"
//                                                     value={data.address.country}
//                                                     onChange={(e) => {
//                                                         const updatedAddress = { ...data.address, country: e.target.value }
//                                                         setData({ ...data, address: updatedAddress })
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <p className="p-2 border rounded-md">
//                                             {data.address.street}, {data.address.city}, {data.address.state} {data.address.postalCode},{" "}
//                                             {data.address.country}
//                                         </p>
//                                     )}
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </CardContent>
//             </Card>
//
//             {/* Professional/Medical Information */}
//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>{userType === "doctor" ? "Professional Information" : "Medical Information"}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6">
//                     {userType === "doctor" ? (
//                         <>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="specialization">Specialization</Label>
//                                     {isEditing ? (
//                                         <Select
//                                             value={data.specialization}
//                                             onValueChange={(value) => handleSelectChange("specialization", value)}
//                                         >
//                                             <SelectTrigger id="specialization">
//                                                 <SelectValue placeholder="Select specialization" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="None">None</SelectItem>
//                                                 <SelectItem value="Cardiology">Cardiology</SelectItem>
//                                                 <SelectItem value="Dermatology">Dermatology</SelectItem>
//                                                 <SelectItem value="Pediatrics">Pediatrics</SelectItem>
//                                                 <SelectItem value="Neurology">Neurology</SelectItem>
//                                                 <SelectItem value="Orthopedics">Orthopedics</SelectItem>
//                                                 <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
//                                                 <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
//                                                 <SelectItem value="Psychiatry">Psychiatry</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     ) : (
//                                         <p className="p-2 border rounded-md">{data.specialization}</p>
//                                     )}
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="licenseNumber">License Number</Label>
//                                     {isEditing ? (
//                                         <Input id="licenseNumber" name="licenseNumber" value={data.licenseNumber} onChange={handleChange} />
//                                     ) : (
//                                         <p className="p-2 border rounded-md">{data.licenseNumber}</p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="experience">Years of Experience</Label>
//                                     {isEditing ? (
//                                         <Input
//                                             id="experience"
//                                             name="experience"
//                                             type="number"
//                                             value={data.experience.toString()}
//                                             onChange={handleChange}
//                                         />
//                                     ) : (
//                                         <p className="p-2 border rounded-md">{data.experience} years</p>
//                                     )}
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
//                                     {isEditing ? (
//                                         <Input
//                                             id="consultationFee"
//                                             name="consultationFee"
//                                             type="number"
//                                             value={data.consultationFee.toString()}
//                                             onChange={handleChange}
//                                         />
//                                     ) : (
//                                         <p className="p-2 border rounded-md">${data.consultationFee}</p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             <div className="space-y-2">
//                                 <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
//                                 {isEditing ? (
//                                     <Input
//                                         id="qualifications"
//                                         name="qualifications"
//                                         value={data.qualifications.join(", ")}
//                                         onChange={(e) => {
//                                             const quals = e.target.value
//                                                 .split(",")
//                                                 .map((q) => q.trim())
//                                                 .filter((q) => q)
//                                             handleSelectChange("qualifications", quals)
//                                         }}
//                                     />
//                                 ) : (
//                                     <p className="p-2 border rounded-md">
//                                         {data.qualifications.length > 0 ? data.qualifications.join(", ") : "None specified"}
//                                     </p>
//                                 )}
//                             </div>
//
//                             <div className="space-y-2">
//                                 <Label htmlFor="hospitalAffiliation">Hospital Affiliations (comma separated)</Label>
//                                 {isEditing ? (
//                                     <Input
//                                         id="hospitalAffiliation"
//                                         name="hospitalAffiliation"
//                                         value={data.hospitalAffiliation.join(", ")}
//                                         onChange={(e) => {
//                                             const affiliations = e.target.value
//                                                 .split(",")
//                                                 .map((a) => a.trim())
//                                                 .filter((a) => a)
//                                             handleSelectChange("hospitalAffiliation", affiliations)
//                                         }}
//                                     />
//                                 ) : (
//                                     <p className="p-2 border rounded-md">
//                                         {data.hospitalAffiliation.length > 0 ? data.hospitalAffiliation.join(", ") : "None specified"}
//                                     </p>
//                                 )}
//                             </div>
//
//                             <div className="space-y-2">
//                                 <Label htmlFor="languagesSpoken">Languages Spoken (comma separated)</Label>
//                                 {isEditing ? (
//                                     <Input
//                                         id="languagesSpoken"
//                                         name="languagesSpoken"
//                                         value={data.languagesSpoken.join(", ")}
//                                         onChange={(e) => {
//                                             const languages = e.target.value
//                                                 .split(",")
//                                                 .map((l) => l.trim())
//                                                 .filter((l) => l)
//                                             handleSelectChange("languagesSpoken", languages)
//                                         }}
//                                     />
//                                 ) : (
//                                     <p className="p-2 border rounded-md">
//                                         {data.languagesSpoken.length > 0 ? data.languagesSpoken.join(", ") : "None specified"}
//                                     </p>
//                                 )}
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             {/* Patient medical information fields */}
//                             {/* These are kept from your original code but not shown in this example */}
//                         </>
//                     )}
//
//                     <div className="space-y-2">
//                         <Label htmlFor="bio">Bio</Label>
//                         {isEditing ? (
//                             <Textarea id="bio" name="bio" rows={4} value={data.bio || ""} onChange={handleChange} />
//                         ) : (
//                             <p className="p-2 border rounded-md">{data.bio ? data.bio : "No bio provided"}</p>
//                         )}
//                     </div>
//                 </CardContent>
//                 {isEditing && (
//                     <CardFooter className="flex justify-end gap-2">
//                         <Button variant="outline" onClick={() => setIsEditing(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleSave} disabled={saving}>
//                             {saving ? (
//                                 <>
//                                     <span className="animate-spin mr-2">⟳</span>
//                                     Saving...
//                                 </>
//                             ) : (
//                                 "Save Changes"
//                             )}
//                         </Button>
//                     </CardFooter>
//                 )}
//             </Card>
//
//             {/* Upcoming Appointments - only shown for patients */}
//             {userType === "patient" && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Upcoming Appointment</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex items-center gap-4">
//                             <Avatar className="h-12 w-12 bg-blue-500">
//                                 <AvatarFallback>MS</AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1">
//                                 <h3 className="font-medium">{sampleAppointment.doctorName}</h3>
//                                 <p className="text-sm text-muted-foreground">{sampleAppointment.specialty}</p>
//                                 <p className="text-sm">
//                                     {sampleAppointment.date}, {sampleAppointment.time}
//                                 </p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button variant="outline">Reschedule</Button>
//                                 <Button>Join Video Call</Button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }
//
