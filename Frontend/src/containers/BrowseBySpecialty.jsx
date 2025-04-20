import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Brain, SmileIcon as Tooth, Eye } from "lucide-react";

const MotionCard = motion(Card);
const MotionIcon = motion.div;

const SpecialtyCard = ({ icon: Icon, name, doctorCount, color, delay }) => {
    return (
        <MotionCard
            className="hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, delay }}
        >
            <CardContent className="p-6">
                <div className="flex flex-col items-start gap-2">
                    <MotionIcon
                        className={`p-2 rounded-full ${color}`}
                        initial={{ rotate: 0, scale: 0 }}
                        animate={{ rotate: 360, scale: 1 }}
                        transition={{ duration: 0.5, delay: delay + 0.1 }}
                    >
                        <Icon className="h-6 w-6" />
                    </MotionIcon>
                    <h3 className="font-semibold text-base">{name}</h3>
                    <p className="text-sm text-muted-foreground">{doctorCount} doctors</p>
                </div>
            </CardContent>
        </MotionCard>
    );
};

export default function BrowseBySpecialty() {
    const specialties = [
        {
            icon: Heart,
            color: "bg-red-100 text-red-500",
            name: "Cardiology",
            doctorCount: 48,
        },
        {
            icon: Brain,
            color: "bg-pink-100 text-pink-500",
            name: "Neurology",
            doctorCount: 36,
        },
        {
            icon: Tooth,
            color: "bg-gray-100 text-gray-600",
            name: "Dentistry",
            doctorCount: 52,
        },
        {
            icon: Eye,
            color: "bg-blue-100 text-blue-500",
            name: "Ophthalmology",
            doctorCount: 29,
        },
    ];

    return (
        <section className="py-12 bg-gray-50 px-6">
            <div className="container px-4 mx-auto">
                <h2 className="text-2xl font-bold mb-8">Browse by Speciality</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {specialties.map((specialty, index) => (
                        <SpecialtyCard
                            key={index}
                            icon={specialty.icon}
                            name={specialty.name}
                            doctorCount={specialty.doctorCount}
                            color={specialty.color}
                            delay={index * 0.2}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
