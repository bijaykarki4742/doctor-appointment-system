import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-200 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* EasyCare Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">EasyCare</h2>
                        <p className="text-slate-300">Book doctor appointments easily and efficiently.</p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contactUs" className="text-slate-300 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Specialties Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Specialties</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/specialties/cardiology" className="text-slate-300 hover:text-white transition-colors">
                                    Cardiology
                                </Link>
                            </li>
                            <li>
                                <Link to="/specialties/neurology" className="text-slate-300 hover:text-white transition-colors">
                                    Neurology
                                </Link>
                            </li>
                            <li>
                                <Link to="/specialties/dentistry" className="text-slate-300 hover:text-white transition-colors">
                                    Dentistry
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4" href="">Contact Us</h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+1 234 567 890</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>contact@easycare.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-700">
                    <p className="text-center text-slate-400">© 2025 EasyCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}



