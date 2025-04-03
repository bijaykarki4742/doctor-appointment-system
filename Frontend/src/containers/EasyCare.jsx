// import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
// import { Card, CardDescription, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import FeaturedDoctors from "@/containers/doctor-feature.jsx";
import BrowseBySpecialty from "@/containers/BrowseBySpecialty.jsx";
import HowItWorks from "@/containers/HowItWork.jsx";
import Footer from "@/containers/Footer.jsx";

const EasyCare = () => {

    // const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar */}
            <Navbar></Navbar>
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left Side Content */}
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-3xl font-bold mb-2">EasyCare</h1>
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

                {/*/!* Basic Information Section *!/*/}
                {/*<div className="mt-16">*/}
                {/*    <h2 className="text-2xl font-bold text-center mb-2">Basic Information</h2>*/}
                {/*    <p className="text-center text-gray-600 mb-8">View and Update Your Bio</p>*/}

                {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">*/}
                {/*        /!* Name Card *!/*/}
                {/*        <div className="flex flex-col items-center p-4">*/}
                {/*            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">*/}
                {/*                <span className="text-2xl">😃</span>*/}
                {/*            </div>*/}
                {/*            <p className="text-gray-600 mb-1">Name</p>*/}
                {/*            <p className="font-semibold">John Doe</p>*/}
                {/*        </div>*/}

                {/*        /!* Age Card *!/*/}
                {/*        <div className="flex flex-col items-center p-4">*/}
                {/*            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">*/}
                {/*                <div className="text-center">*/}
                {/*                    <span className="text-sm">📅</span>*/}
                {/*                    <div className="font-bold">17</div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <p className="text-gray-600 mb-1">Age</p>*/}
                {/*            <p className="font-semibold">35</p>*/}
                {/*        </div>*/}

                {/*        /!* Gender Card *!/*/}
                {/*        <div className="flex flex-col items-center p-4">*/}
                {/*            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">*/}
                {/*                <span className="text-2xl">♂️</span>*/}
                {/*            </div>*/}
                {/*            <p className="text-gray-600 mb-1">Gender</p>*/}
                {/*            <p className="font-semibold">Male</p>*/}
                {/*        </div>*/}

                {/*        /!* Contact Card *!/*/}
                {/*        <div className="flex flex-col items-center p-4">*/}
                {/*            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">*/}
                {/*                <span className="text-2xl">📞</span>*/}
                {/*            </div>*/}
                {/*            <p className="text-gray-600 mb-1">Contact</p>*/}
                {/*            <p className="font-semibold">+1234567890</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <FeaturedDoctors></FeaturedDoctors>
            <BrowseBySpecialty></BrowseBySpecialty>
            <HowItWorks></HowItWorks>
            <Footer></Footer>
        </div>
    );
};

export default EasyCare;
