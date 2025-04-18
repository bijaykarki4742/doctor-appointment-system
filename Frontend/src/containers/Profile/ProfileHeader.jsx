import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Check, Calendar, Mail, MapPin, Phone, Shield, Edit, User } from "lucide-react"

export default function ProfileHeader({ data, userType, isEditing, toggleEditMode }) {
    const [imageHover, setImageHover] = useState(false);

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return null;
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    // Get user initials for avatar fallback
    const getInitials = () => {
        return `${data.firstName?.charAt(0) || ""}${data.lastName?.charAt(0) || ""}`;
    };

    return (
        <Card className="border-0 shadow-lg overflow-hidden mb-8">
            {/* Cover photo background - can be customized based on user preferences */}
            <div className="h-32 bg-blue-500 relative">
                {userType === "doctor" && data.isVerified && (
                    <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />
                        Verified Professional
                    </Badge>
                )}
            </div>

            <CardContent className="pt-0 px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 relative">
                    {/* Profile picture section */}
                    <div
                        className="relative"
                        onMouseEnter={() => setImageHover(true)}
                        onMouseLeave={() => setImageHover(false)}
                    >
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-2 ring-blue-100">
                            <AvatarImage
                                src={data.profilePicture || "/placeholder.svg?height=200&width=200"}
                                alt={`${data.firstName} ${data.lastName}`}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-2xl bg-blue-50 text-blue-500 font-semibold">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="secondary"
                            size="icon"
                            className={`absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-opacity ${imageHover ? 'opacity-100' : 'opacity-75'}`}
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* User information section */}
                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-end pt-4 sm:pt-0">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {data.firstName} {data.lastName}
                            </h2>

                            <div className="mt-2 flex flex-wrap gap-3">
                                {userType === "doctor" && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-1.5 text-blue-500" />
                                        <span>{data.specialization || "Medical Professional"}</span>
                                    </div>
                                )}

                                {data.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1.5 text-blue-500" />
                                        <span>{data.location}</span>
                                    </div>
                                )}

                                {data.dateOfBirth && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                                        <span>Age: {calculateAge(data.dateOfBirth)}</span>
                                    </div>
                                )}

                                {userType === "doctor" && data.patientCount && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Shield className="h-4 w-4 mr-1.5 text-blue-500" />
                                        <span>{data.patientCount}+ Patients</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-0 flex gap-3">
                            {!isEditing && (
                                <Button variant="outline" className="gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-800">
                                    <Phone className="h-4 w-4" />
                                    Contact
                                </Button>
                            )}

                            <Button
                                onClick={toggleEditMode}
                                className={`gap-2 ${isEditing ? 'bg-gray-800 hover:bg-gray-900' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isEditing ? (
                                    <>
                                        <User className="h-4 w-4" />
                                        View Profile
                                    </>
                                ) : (
                                    <>
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional contact information */}
                {data.email || data.phone ? (
                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-2">
                        {data.email && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{data.email}</span>
                            </div>
                        )}

                        {data.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{data.phone}</span>
                            </div>
                        )}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
