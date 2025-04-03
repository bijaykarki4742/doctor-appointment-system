import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, SmileIcon as Tooth, Eye } from "lucide-react";

const SpecialtyCard = ({ icon, name, doctorCount }) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col items-start gap-1">
                    <div className="mb-1 text-black">{icon}</div>
                    <h3 className="font-semibold text-base">{name}</h3>
                    <p className="text-sm text-muted-foreground">{doctorCount} doctors</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default function BrowseBySpecialty() {
    const specialties = [
        {
            icon: <Heart className="h-6 w-6 fill-black" />,
            name: "Cardiology",
            doctorCount: 48,
        },
        {
            icon: <Brain className="h-6 w-6 fill-black" />,
            name: "Neurology",
            doctorCount: 36,
        },
        {
            icon: <Tooth className="h-6 w-6 fill-black" />,
            name: "Dentistry",
            doctorCount: 52,
        },
        {
            icon: <Eye className="h-6 w-6 fill-black" />,
            name: "Ophthalmology",
            doctorCount: 29,
        },
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="container px-4 mx-auto">
                <h2 className="text-2xl font-bold mb-8">Browse by Specialty</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {specialties.map((specialty, index) => (
                        <SpecialtyCard
                            key={index}
                            icon={specialty.icon}
                            name={specialty.name}
                            doctorCount={specialty.doctorCount}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
