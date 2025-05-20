import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Check, Calendar, Mail, MapPin, Phone, Shield, Edit, User, Verified } from "lucide-react"
import VerificationDialog from "./VerificationDialog"
import toast from "react-hot-toast"
import api from "@/api/axios"

export default function ProfileHeader({ data, userType, isEditing, toggleEditMode, doctorId }) {
    const [imageHover, setImageHover] = useState(false);
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return null;
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    // Get user initials for avatar fallback
    const getInitials = () => {
        return `${data.firstName?.charAt(0) || ""}${data.lastName?.charAt(0) || ""}`;
    };

    const token = localStorage.getItem("token")
    const handleVerificationSubmit = async (imageFile) => {

        try {
            const formData = new FormData();
            formData.append('verificationImage', imageFile);

            const response = await api.post(
                `/verification/${doctorId}/submit`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setShowVerificationDialog(false);
            toast.success("Verification submitted successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error submitting verification:", error);
            toast.error(error.message);
        }
    };

    return (
        <>
            <Card className="border-0 shadow-lg overflow-hidden mb-4">
                <div className="h-32 bg-gradient-to-r from-teal-400 to-teal-600 relative">
                    {userType === "doctor" && data.isVerified && (
                        <Badge className="absolute top-4 right-4 bg-white text-teal-600 hover:bg-white/90 border-0 px-3 py-1 flex items-center gap-1.5 shadow-sm text-xs font-medium">
                            <Check className="h-3.5 w-3.5" />
                            Verified Professional
                        </Badge>
                    )}
                </div>

                <CardContent className="pt-0 px-4 sm:px-6 pb-6">
                    <div className="flex flex-col items-center -mt-16 relative">
                        {/* Profile picture */}
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-teal-100">
                                <AvatarImage
                                    src={data.profilePicture || "/placeholder.svg?height=200&width=200"}
                                    alt={`${data.firstName} ${data.lastName}`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-2xl bg-teal-50 text-teal-600 font-semibold">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* User info section - centered and stacked */}
                        <div className="w-full mt-4 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {data.firstName} {data.lastName}
                            </h2>

                            {/* Info items grid - responsive and centered */}
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
                                {userType === "doctor" && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-1.5 text-teal-500 flex-shrink-0" />
                                        <span>{data.specialization || "Medical Professional"}</span>
                                    </div>
                                )}

                                {data.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1.5 text-teal-500 flex-shrink-0" />
                                        <span>{data.location}</span>
                                    </div>
                                )}

                                {data.experience && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1.5 text-teal-500 flex-shrink-0" />
                                        <span>{data.experience} Years Exp</span>
                                    </div>
                                )}

                                {userType === "doctor" && data.patientCount && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Shield className="h-4 w-4 mr-1.5 text-teal-500 flex-shrink-0" />
                                        <span>{data.patientCount}+ Patients</span>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap justify-center gap-3 mt-5">
                                {!isEditing && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800 text-sm"
                                        onClick={() => setShowVerificationDialog(true)}
                                    >
                                        <Verified className="h-4 w-4" />
                                        Get Verified
                                    </Button>
                                )}

                                <Button
                                    onClick={toggleEditMode}
                                    size="sm"
                                    className={`gap-1.5 text-sm ${isEditing ? 'text-white bg-teal-600 hover:bg-teal-700' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
                                >
                                    {isEditing ? (
                                        <>
                                            <User className="h-4 w-4" />
                                            View
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Contact info - centered and stacked */}
                    {(data.email || data.phone) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap justify-center  gap-x-6 gap-y-2">
                            {data.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                                    <span>{data.email}</span>
                                </div>
                            )}
                            {data.contact && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                                    <span>{data.contact}</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Verification Dialog */}
            {showVerificationDialog && (
                <VerificationDialog
                    onClose={() => setShowVerificationDialog(false)}
                    onSubmit={handleVerificationSubmit}
                />
            )}
        </>
    )
}
