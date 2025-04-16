"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { StatsCard } from "@/pages/stats-card";
import Navbar from "@/containers/Navbar.jsx";
import Footer from "@/containers/Footer.jsx";

export default function AboutSection() {
    return (
        <>
            <Navbar color="white" dark expand="md"></Navbar>
            <section className="bg-blue-500 text-white py-16">
                <div className="container mx-auto px-4">
                    <Card className="bg-opacity-70 bg-white shadow-lg rounded-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                            <CardTitle className="text-3xl font-bold">About EasyCare</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <p className="text-lg text-black font-bold">
                                EasyCare is a revolutionary doctor appointment system designed to simplify the process
                                of booking and managing medical appointments. Our user-friendly platform connects
                                patients with healthcare professionals in a seamless and efficient manner.
                            </p>
                            <p className="text-lg text-black font-bold">
                                With EasyCare, patients can easily search for doctors by specialty, view their
                                availability, and book appointments online. Our system ensures that both patients and
                                doctors have a smooth and hassle-free experience.
                            </p>
                            <p className="text-lg text-black font-bold">
                                We prioritize patient privacy and data security, ensuring that all personal and medical
                                information is handled with the utmost care and confidentiality.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatsCard title="Doctors" value="500+" icon="👨‍⚕️"/>
                                <StatsCard title="Appointments" value="10,000+" icon="📅"/>
                                <StatsCard title="Patients" value="20,000+" icon="👩‍⚕️"/>
                            </div>
                            <div className="flex justify-center">
                                <Button className="bg-white text-blue-500 hover:bg-blue-100">
                                    Learn More <ArrowRight className="h-4 w-4 ml-2"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <Footer></Footer>
        </>

    );
}
