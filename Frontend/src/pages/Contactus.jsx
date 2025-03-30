import ContactInfo from "@/containers/ContactInfo.jsx";
import ContactForm from "@/containers/ContactForm.jsx";
import Footer from "@/containers/Footer.jsx";
import Navbar from "@/containers/Navbar.jsx";
import React from "react";


function Contactus() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar></Navbar>
            <main className="flex-grow container my-12 mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    Need to schedule an appointment or have a question? Contact us through the information below or send us a direct message.
                </p>

                <ContactInfo />
                <ContactForm />

                <div className="mt-12">
                    <img
                        src="https://www.google.com/imgres?q=hospital%20photo&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F88%2FHospital-de-Bellvitge.jpg%2F640px-Hospital-de-Bellvitge.jpg&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHospital&docid=-0YIbTGxKzHoqM&tbnid=7wkF0myBLBCrSM&vet=12ahUKEwjhlPKooLKMAxVl4jgGHfHzGCUQM3oECGwQAA..i&w=640&h=446&hcb=2&ved=2ahUKEwjhlPKooLKMAxVl4jgGHfHzGCUQM3oECGwQAA"
                        alt="Medical Facility"
                        className="w-full h-96 object-cover rounded-lg"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
export default Contactus
