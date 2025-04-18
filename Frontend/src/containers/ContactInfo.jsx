import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactInfo = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
                {/* Phone Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-blue-100 rounded-full">
                            <Phone size={32} className="text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">Phone</h3>
                    <p className="text-gray-600 mb-1 font-medium">(555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Mon - Fri, 9am - 5pm</p>
                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full font-medium transition-all duration-300">
                        Call Now
                    </button>
                </div>

                {/* Email Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-green-100 rounded-full">
                            <Mail size={32} className="text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">Email</h3>
                    <p className="text-gray-600 mb-1 font-medium">contact@medicare.com</p>
                    <p className="text-gray-500 text-sm">support@medicare.com</p>
                    <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full font-medium transition-all duration-300">
                        Send Email
                    </button>
                </div>

                {/* Location Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-purple-100 rounded-full">
                            <MapPin size={32} className="text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">Location</h3>
                    <p className="text-gray-600 mb-1 font-medium">123 Healthcare St</p>
                    <p className="text-gray-500 text-sm">New York, NY 10001</p>
                    <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full font-medium transition-all duration-300">
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
