// import ContactInfo from "@/containers/ContactInfo.jsx";
// import ContactForm from "@/containers/ContactForm.jsx";
// import Footer from "@/containers/Footer.jsx";
// import Navbar from "@/containers/Navbar.jsx";
// import React from "react";


// function Contactus() {
//     return (
//         <div className="min-h-screen flex flex-col">
//             <Navbar></Navbar>
//             <main className="flex-grow container my-12 mx-auto px-4 py-12">
//                 <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>
//                 <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//                     Need to schedule an appointment or have a question? Contact us through the information below or send us a direct message.
//                 </p>

//                 <ContactInfo />
//                 <ContactForm />

//                 <div className="mt-12">
//                     <img
//                         src="public/medical-clinics-mob.webp"
//                         alt="Medical Facility"
//                         className="w-full h-96 object-cover rounded-lg"
//                     />
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// }
// export default Contactus
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

                <div
                    className="relative mt-12 w-full max-w-full rounded-lg overflow-hidden shadow-2xl border-4 border-blue-200"
                    style={{ height: "24rem" }} // same as h-96
                >
                    <img
                        src="https://thumbs.dreamstime.com/z/doctor-health-insurance-healthcare-graphic-concept-hospital-related-icon-interface-showing-people-money-planning-risk-181467316.jpg"
                        alt="Medical Healthcare Concept"
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "auto" }}
                    />
                    {/* Gradient overlay for visual intrigue */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent pointer-events-none" />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Contactus;
