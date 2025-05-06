import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EasyCare = () => {

    return (
        <div className="bg-white px-6">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left Side Content */}
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl font-bold mb-2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text">
                                EasyCare
                            </h1>

                            <motion.p
                                className="text-gray-700 text-xl md:text-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                            >
                                Care at Your <span className="font-semibold text-emerald-600 ">Fingertips</span>.
                            </motion.p>
                        </motion.div>

                        <motion.p
                            className="text-gray-600 text-lg py-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Find and book appointments with the best doctors near you. Quick, easy, and convenient scheduling at your fingertips.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap gap-4 pt-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <Link to="/DoctorList">
                                <Button
                                    size="lg"
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg"
                                >
                                    Book Appointment
                                </Button>
                            </Link>
                            <Link to="/DoctorList">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-teal-500 border-2 border-teal-600 hover:bg-teal-50 px-8 py-6 text-lg"

                                >
                                    Find Doctors
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Side Image */}
                    <motion.div
                        className="md:w-1/2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="relative w-full max-w-lg aspect-square">
                            <img
                                src="/docimg.png"
                                alt="Doctor with patient illustration"
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EasyCare;
