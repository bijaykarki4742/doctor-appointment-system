import { Search, Calendar, Check } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="h-6 w-6" />,
            title: "Search Doctor",
            description: "Find the right doctor based on your needs",
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Book Appointment",
            description: "Select suitable time slot and book instantly",
        },
        {
            icon: <Check className="h-6 w-6" />,
            title: "Get Consultation",
            description: "Visit doctor and get your consultation",
        },
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="bg-blue-100 rounded-full p-6 mb-6">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
