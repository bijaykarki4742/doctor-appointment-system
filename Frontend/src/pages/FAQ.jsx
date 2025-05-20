import { useState } from 'react';
import Footer from "@/containers/Footer";
import Navbar from "@/containers/Navbar";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "You can book appointments through our website or mobile app. Simply select your preferred doctor, choose an available time slot, and confirm your booking. You'll receive a confirmation email with all the details."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule up to 24 hours before your appointment time. Log in to your account, go to 'My Appointments', and select the option to modify your booking."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and direct bank transfers. Some clinics may also accept cash payments on-site."
    },
    {
      question: "How do I find the right specialist for my needs?",
      answer: "Our platform includes detailed profiles for each doctor with their specialties, qualifications, and patient reviews. You can use our search filters or take our quick questionnaire to get personalized recommendations."
    },
    {
      question: "Is my personal and medical information secure?",
      answer: "Absolutely. We use end-to-end encryption and comply with all healthcare data protection regulations. Your information is never shared without your consent."
    },
    {
      question: "What if I need urgent medical care?",
      answer: "For life-threatening emergencies, please call your local emergency number immediately. Our platform is designed for non-emergency appointments. However, we do offer same-day urgent care appointments when available."
    },
    {
      question: "Can I book appointments for family members?",
      answer: "Yes, you can add family members to your account and manage appointments for them. You'll need their basic information and medical history to complete the booking."
    },
    {
      question: "Do you offer telemedicine/virtual consultations?",
      answer: "Many of our providers offer virtual consultations. Look for the 'Video Visit' option when booking. You'll receive a secure link to join your appointment at the scheduled time."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions about booking appointments, payments, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="w-full">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-200">
                  <button
                    className="flex w-full items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="text-lg font-medium text-slate-800 text-left">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Still have questions?</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions or concerns.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}