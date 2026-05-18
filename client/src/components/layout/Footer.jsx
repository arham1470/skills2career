import React from "react";
import { Mail, MapPin, Phone, Globe, Share2, Users, Image } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <img src={logo} alt="Skills2Career" className="h-24 md:h-32 w-auto object-contain" />
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Connecting Sri Lankan students with meaningful internship opportunities through intelligent skill-based matching.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Users className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Image className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Browse Internships</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Companies</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Career Advice</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>Colombo, Sri Lanka</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>support@skills2career.lk</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                                <span>+94 11 234 5678</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Skills2Career. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;