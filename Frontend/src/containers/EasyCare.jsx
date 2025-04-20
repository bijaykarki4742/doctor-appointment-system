import { Button } from "@/components/ui/button";
import FeaturedDoctors from "@/containers/doctor-feature.jsx";
import BrowseBySpecialty from "@/containers/BrowseBySpecialty.jsx";
import HowItWorks from "@/containers/HowItWork.jsx";
import Footer from "@/containers/Footer.jsx";
import { motion } from "framer-motion";


const EasyCare = () => {

    return (
        <div className="bg-white px-6">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left Side Content */}
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-6xl font-bold mb-2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-transparent bg-clip-text"

                        >
                            EasyCare
                        </motion.h1>

                        <p className="text-gray-700 mb-6">Care at Your Fingertips.</p>

                        {/* Search Bar */}
                        <div className="relative flex items-center mb-8">
                            <input
                                type="text"
                                placeholder="Search Doctor, Hospital, Clinic, Labs, Medicines ..."
                                className="w-full py-3 px-4 bg-gray-100 rounded-md"
                            />
                            <Button>Search</Button>
                        </div>
                    </div>

                    {/* Right Side Image */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="docimg.png"
                            alt="Healthcare services illustration"
                            className="w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EasyCare;
