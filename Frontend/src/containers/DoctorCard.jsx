import { Star, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DoctorCard({ doctor }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.substring(4, 6)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="font-medium text-lg text-primary">{doctor.name}</h3>
                        <p className="text-sm text-blue-500">{doctor.specialty}</p>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                            <span className="text-sm text-muted-foreground">• {doctor.reviews} Reviews</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{doctor.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {/*<div>*/}
                    {/*    <p className="text-sm text-muted-foreground">Next Available</p>*/}
                    {/*    <p className="font-medium">*/}
                    {/*        {doctor.nextAvailable.day}, {doctor.nextAvailable.time}*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                    <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
                </div>
            </CardContent>
        </Card>
    )
}
