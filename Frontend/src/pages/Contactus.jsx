import ContactInfo from "@/containers/ContactInfo.jsx";
import ContactForm from "@/containers/ContactForm.jsx";
import Footer from "@/containers/Footer.jsx";
import Navbar from "@/containers/Navbar.jsx";
import React from "react";

function Contactus() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow container my-12 mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    Need to schedule an appointment or have a question? Contact us through the information below or send us a direct message.
                </p>

                <ContactInfo />
                <ContactForm />

                <div className="mt-12">
                    <img
                        src="/medical-clinics-mob.webp"
                        alt="Medical Facility"
                        className="w-full max-h-[600px] object-contain rounded-2xl shadow-lg"
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Contactus;
