import { Search, Calendar, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="h-6 w-6 text-blue-500" />,
            title: "Search Doctor",
            description: "Find the right doctor based on your needs",
            color: "bg-blue-100",
        },
        {
            icon: <Calendar className="h-6 w-6 text-purple-500" />,
            title: "Book Appointment",
            description: "Select suitable time slot and book instantly",
            color: "bg-purple-100",
            Link: "/bookDoctor",
        },
        {
            icon: <Check className="h-6 w-6 text-green-500" />,
            title: "Get Consultation",
            description: "Visit doctor and get your consultation",
            color: "bg-green-100",
        },
    ];

    return (
        <section className="py-20 px-6 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <MotionDiv
                            key={index}
                            className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3, delay: index * 0.2 }}
                        >
                            <motion.div
                                className={`rounded-full p-6 mb-6 ${step.color}`}
                                initial={{ rotate: 0, scale: 0 }}
                                animate={{ rotate: 360, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.2 }}
                            >
                                {step.icon}
                            </motion.div>

                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
