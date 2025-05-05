"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast, toast} from "@/components/ui/use-toast.js"
import api from "@/api/axios.js"
import ProfileHeader from "@/containers/Profile/ProfileHeader"
import PersonalInformation from "@/containers/Profile/PersonalInformation"
import ProfessionalInformation from "@/containers/Profile/ProfessionalInformation"
import MedicalInformation from "@/containers/Profile/MedicalInformation"
import UpcomingAppointment from "@/containers/Profile/UpcomingAppointment"
import { Settings } from "lucide-react"

export default function ProfileSettings() {
    const [userType, setUserType] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [data, setData] = useState(null)
    const [profileId, setProfileId] = useState(null)
    const [date, setDate] = useState()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const { toast } = useToast()
    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")

            const response = await api.get(`/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log(response);

            const userRole = response.data.user?.role
            const profileData = response.data.profile

            setProfileId(profileData._id)
            console.log(profileId)
            if (userRole === "patient") {
                setData({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: response.data.user?.email || "",
                    contact: profileData.contact || "",
                    dateOfBirth: profileData.dateOfBirth || "",
                    gender: profileData.gender || "",
                    address: profileData.address || {},
                    insuranceInfo: profileData.insuranceInfo || {},
                    medicalHistory: profileData.medicalHistory || [],
                    allergies: profileData.allergies || [],
                    emergencyContact: profileData.emergencyContact || {},
                    profilePicture: profileData.profilePicture || "/placeholder.svg?height=200&width=200"
                })
            } else if (userRole === "doctor") {
                setData({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: response.data.user?.email || "",
                    contact: profileData.contact || "",
                    specialization: profileData.specialization || "None",
                    licenseNumber: profileData.licenseNumber || "",
                    gender: profileData.gender || "male",
                    qualifications: profileData.qualifications || [],
                    hospitalAffiliation: profileData.hospitalAffiliation || [],
                    experience: profileData.experience || 0,
                    bio: profileData.bio || "",
                    languagesSpoken: profileData.languagesSpoken || [],
                    consultationFee: profileData.consultationFee || 0,
                    profilePicture: profileData.profilePicture || "/placeholder.svg?height=200&width=200",
                    isVerified: profileData.isVerified || false
                })
            }

            setUserType(userRole)
            setError("")
        } catch (error) {
            console.error("Failed to fetch profile", error)
            setError(error.message || "Failed to fetch profile")
            toast({
                title: "Error",
                description: "Failed to load profile data. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }


    const handleSave = () => {
        if (userType === "doctor" || userType === "patient") {
            updateUserProfile({
                role: userType,
                profileId,
                data,
                setSaving,
                setIsEditing,
                fetchUserData,
                toast
            })
        } else {
            console.log("Saving patient data:", data)
            setIsEditing(false)
        }
    }


    const updateUserProfile = async ({ role, profileId, data, setSaving, setIsEditing, fetchUserData, toast }) => {
        try {
            setSaving(true)

            const token = localStorage.getItem("token")
            if (!token) throw new Error("No authentication token found")
            if (!profileId) throw new Error("Profile ID not found. Please refresh the page.")

            let updateData = {}
            let endpoint = ""

            if (role === "doctor") {
                updateData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contact: data.contact,
                    specialization: data.specialization,
                    licenseNumber: data.licenseNumber,
                    gender: data.gender,
                    qualifications: data.qualifications,
                    hospitalAffiliation: data.hospitalAffiliation,
                    experience: Number(data.experience),
                    bio: data.bio,
                    languagesSpoken: data.languagesSpoken,
                    consultationFee: Number(data.consultationFee),
                }
                endpoint = `/doctors/update/${profileId}`
            } else if (role === "patient") {
                updateData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contact: data.contact,
                    age: Number(data.age),
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender,
                    address: data.address,
                    insuranceInfo: data.insuranceInfo,
                    medicalHistory: data.medicalHistory,
                    allergies: data.allergies,
                    emergencyContact: data.emergencyContact,
                    profilePicture: data.profilePicture,
                }
                endpoint = `/users/update/${profileId}`
            } else {
                throw new Error("Invalid role")
            }

            const response = await api.patch(endpoint, updateData, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const success = response.data.doctor || response.data.profile || response.data.patient
            if (success) {
                toast({
                    title: "Success",
                    description: "Profile updated successfully",
                })
                console.log("Saving this data:", data)
                await fetchUserData()
            } else {
                throw new Error(response.data.message || "Failed to update profile")
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
            setIsEditing(false)
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const handleSelectChange = (name, value) => {
        setData({ ...data, [name]: value })
    }

    const handleDateChange = (newDate) => {
        setDate(newDate)
        if (userType === "patient" && newDate) {
            setData({ ...data, dateOfBirth: newDate })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6 max-w-4xl">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-lg">Loading profile data...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !data || !userType) {
        return (
            <div className="container mx-auto py-6 max-w-4xl">
                <div className="bg-destructive/10 p-6 rounded-lg text-center">
                    <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Profile</h2>
                    <p className="mb-4">{error || "Unable to determine user role."}</p>
                    <Button onClick={fetchUserData}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </div>

            <ProfileHeader data={data} userType={userType} isEditing={isEditing} toggleEditMode={() => setIsEditing(!isEditing)} />

            <PersonalInformation
                data={data}
                userType={userType}
                isEditing={isEditing}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                date={date}
                handleDateChange={handleDateChange}
                setData={setData}
            />

            {userType === "doctor" ? (
                <ProfessionalInformation
                    data={data}
                    isEditing={isEditing}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    handleSave={handleSave}
                    saving={saving}
                    setIsEditing={setIsEditing}
                />
            ) : (
                <MedicalInformation
                    data={data}
                    isEditing={isEditing}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    saving={saving}
                    setIsEditing={setIsEditing}
                />
            )}

            {/*{userType === "patient" && <UpcomingAppointment />}*/}
        </div>
    )
}
