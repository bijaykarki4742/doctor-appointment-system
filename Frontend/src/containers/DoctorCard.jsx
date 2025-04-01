import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Star } from "lucide-react";

const DoctorCard = ({ doctor }) => {
    return (
        <Card className="w-full overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-muted-foreground text-sm">({doctor.reviews} reviews)</span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Next available: {doctor.availability}</span>
                    </div>
                </div>

                <Button className="w-full">Book</Button>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;
