import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { StatsCard } from "@/pages/stats-card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutSection() {
    // Animation for sections coming into view
    const [ref1, inView1] = useInView({ threshold: 0.2, triggerOnce: true });
    const [ref2, inView2] = useInView({ threshold: 0.2, triggerOnce: true });
    const [ref3, inView3] = useInView({ threshold: 0.2, triggerOnce: true });
    const [ref4, inView4] = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <>
            <section id="about" className="bg-white py-16 px-6">
                <div className="container mx-auto px-16">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
                        <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
                    </motion.div>

                    {/* Mission Section - Left text, right image */}
                    <motion.div
                        ref={ref1}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center m-4 mb-20"
                    >
                        <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                            <h3 className="text-3xl font-bold text-teal-600 mb-4">Our Mission</h3>
                            <p className="text-lg text-gray-700 mb-6">
                                EasyCare is a revolutionary doctor appointment system designed to simplify the process
                                of booking and managing medical appointments. Our user-friendly platform connects
                                patients with healthcare professionals in a seamless and efficient manner.
                            </p>
                            <p className="text-lg text-gray-700">
                                We believe healthcare should be accessible and stress-free for everyone, and we're
                                committed to making that vision a reality.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <div className="rounded-xl overflow-hidden shadow-xl">
                                <img
                                    src="/healthProviders.jpg"
                                    alt="Healthcare professionals"
                                    className="w-full h-auto object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Privacy & Security - Left image, right text */}
                    <motion.div
                        ref={ref2}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row-reverse items-center m-4 mb-20"
                    >
                        <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                            <h3 className="text-3xl font-bold text-teal-600 mb-4">Privacy & Security</h3>
                            <p className="text-lg text-gray-700 mb-6">
                                We prioritize patient privacy and data security, ensuring that all personal and medical
                                information is handled with the utmost care and confidentiality.
                            </p>
                            <p className="text-lg text-gray-700">
                                Our platform employs state-of-the-art encryption and follows strict healthcare
                                data protection standards to keep your information safe and secure.
                            </p>
                        </div>

                        <div className="md:w-1/2">
                            <div className="rounded-xl overflow-hidden shadow-xl ">
                                <div className="flex justify-center">
                                    <img
                                        src="/security.jpg"
                                        alt="Booking interface"
                                        className="w-full h-auto object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div
                        ref={ref3}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView3 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center mb-20"
                    >
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        ref={ref4}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView4 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 shadow-xl"
                    >
                        <h3 className="text-2xl font-bold text-white text-center mb-10">Our Impact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-md transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-teal-600 mb-2">100+</div>
                                <div className="text-xl text-gray-700">Doctors</div>
                                <div className="text-5xl mt-3">👨‍⚕️</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 text-center shadow-md transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-teal-600 mb-2">1,000+</div>
                                <div className="text-xl text-gray-700">Appointments</div>
                                <div className="text-5xl mt-3">📅</div>
                            </div>
                            <div className="bg-white rounded-xl p-6 text-center shadow-md transform transition-transform hover:scale-105">
                                <div className="text-4xl font-bold text-teal-600 mb-2">2,000+</div>
                                <div className="text-xl text-gray-700">Patients</div>
                                <div className="text-5xl mt-3">👩‍⚕️</div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-10">
                            <Button className="bg-white hover:bg-gray-100 text-teal-600 font-semibold px-8 py-3 rounded-md shadow-md">
                                Learn More <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}