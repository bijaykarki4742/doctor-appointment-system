import { Star, MapPin, Calendar, Clock, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import {useUserRole} from "@/Contexts/UserContext.jsx";

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    const {role , loading } = useUserRole()

    if (loading) return <p>Loading...</p>;
    const handleBookNow = () => {
        // Pass the doctor data as state when navigating
        console.log("Current doctor data: ", doctor);
        if (role != null) {
            navigate('/bookDoctor', {
                state: {
                    doctor,
                    id: doctor.id // Reference to User model
                }
            });
        }
        else{
            navigate('/Login');
        }
        console.log(doctor.id);
    }

    // Calculate initials properly from full name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-gray-200">
            <CardContent className="p-0">
                {/* Top banner - can be customized based on doctor status */}
                {doctor.acceptingNewPatients && (
                    <div className="bg-green-500 py-1 px-3">
                        <p className="text-xs font-medium text-white text-center">Accepting New Patients</p>
                    </div>
                )}

                <div className="p-5">
                    <div className="flex gap-4">
                        <Avatar className="h-20 w-20 border-2 border-blue-100 shadow-sm">
                            <AvatarImage src={doctor.image} alt={doctor.name}  className="object-cover w-full h-full" />
                            <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                                {getInitials(doctor.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>
                            <Badge className="bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium ">
                                {doctor.specialty}
                            </Badge>

                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-500">{doctor.reviews} Reviews</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                <span>{doctor.location}</span>
                            </div>
                        </div>
                    </div>

                    {doctor.nextAvailable && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-teal-500" />
                                    <span>Next Available: </span>
                                    <span className="font-medium text-gray-900">
                                        {doctor.nextAvailable.day}, {doctor.nextAvailable.time}
                                    </span>
                                </div>
{/* 
                                <Badge variant="outline" className="border-blue-200 text-blue-600 font-normal">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Virtual Available
                                </Badge> */}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-end">
                        {/* <div className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer flex items-center"
                            onClick={() => navigate(`/doctor/${doctor.id}`)}>
                            View Profile
                           <ChevronRight className="h-4 w-4 ml-1" />
                        </div> */}
                        <Button
                            onClick={handleBookNow}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
