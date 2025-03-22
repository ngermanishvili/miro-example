"use client";

import { useState } from "react";
import { Phone, Mail, X } from "lucide-react";

const FloatingContact = () => {
    const [contactFormOpen, setContactFormOpen] = useState(false);

    const handleWhatsAppClick = () => {
        window.location.href = "tel:+995599000000";
    };

    return (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4">
            {/* WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                className="rounded-full bg-green-500 hover:bg-green-600 text-white p-3 transition-all duration-300 shadow-lg flex items-center justify-center"
                aria-label="WhatsApp Contact"
            >
                <Phone className="w-5 h-5" />
            </button>

            {/* Contact Form Button */}
            <div className="relative" onMouseEnter={() => setContactFormOpen(true)}>
                <button
                    className="rounded-full bg-blue-500 hover:bg-blue-600 text-white p-3 transition-all duration-300 shadow-lg flex items-center justify-center"
                    aria-label="Contact Form"
                >
                    <Mail className="w-5 h-5" />
                </button>

                {/* Contact Form Popup */}
                {contactFormOpen && (
                    <div
                        className="absolute top-0 right-16 w-72 bg-white p-4 transition-all duration-300 shadow-lg"
                        onMouseLeave={() => setContactFormOpen(false)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Contact Us</h3>
                            <button
                                onClick={() => setContactFormOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Message"
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 transition-all duration-300"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingContact; 