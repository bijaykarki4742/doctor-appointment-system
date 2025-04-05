import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"

export default function ProfileHeader({ data, userType, isEditing, toggleEditMode }) {
    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={data.profilePicture || "/placeholder.svg?height=200&width=200"}
                                alt={`${data.firstName} ${data.lastName}`}
                            />
                            <AvatarFallback>
                                {data.firstName?.charAt(0) || ""}
                                {data.lastName?.charAt(0) || ""}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            {data.firstName} {data.lastName}
                        </h2>
                        {userType === "doctor" && data.isVerified && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                                Verified Doctor
                            </p>
                        )}
                        {userType === "patient" && data.dateOfBirth && (
                            <p className="text-muted-foreground">
                                Age: {new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear()}
                            </p>
                        )}
                    </div>
                    <div className="ml-auto">
                        <Button onClick={toggleEditMode}>{isEditing ? "View Profile" : "Edit Profile"}</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

