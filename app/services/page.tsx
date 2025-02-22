"use client"

import React, { useState } from 'react';

interface Service {
    title: string;
    description: string;
}

const services: Service[] = [
    {
        title: "Building permit documentation",
        description: "Professional assistance with all building permit requirements and documentation processes."
    },
    {
        title: "Tender Documentation",
        description: "Comprehensive tender documentation services for construction projects."
    },
    {
        title: "Scan to BIM Modeling",
        description: "We use 3D scanning to capture precise measurements and details of existing spaces or structures. The process involves using advanced laser scanners to create an accurate digital representation of the physical environment."
    },
    {
        title: "BIM Modeling",
        description: "Full-service Building Information Modeling for construction and architecture projects."
    },
    {
        title: "Interior design",
        description: "Creative and functional interior design solutions for all spaces."
    },
    {
        title: "Architecture",
        description: "Complete architectural design services for residential and commercial projects."
    },
    {
        title: "Consulting / Technical support",
        description: "Expert consulting and technical support for construction and design projects."
    }
];

const ServicesSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const handleServiceClick = (index: number) => {
        setIsTransitioning(true);
        setActiveIndex(index);
        // Reset transition state after animation
        setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center space-y-16">
                {/* Image Container */}
                <div className="max-w-full h-[500px] w-[500px] mt-12 aspect-square relative rounded-2xl overflow-hidden shadow-xl">
                    <img
                        src="/api/placeholder/800/800"
                        alt="Services showcase"
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Services Container */}
                <div className="w-full">
                    <div className="flex flex-col md:flex-row min-h-[28rem] w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Left column - Services list */}
                        <div className="w-full md:w-1/2 p-6 md:pr-0 border-r border-gray-100 overflow-y-auto">
                            <div className="space-y-2">
                                {services.map((service, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleServiceClick(index)}
                                        className={`
                                            py-4 px-6 rounded-xl cursor-pointer
                                            transform transition-all duration-300 ease-out
                                            hover:bg-gray-50
                                            ${index === activeIndex ?
                                                'bg-gray-50 translate-x-2 shadow-sm' :
                                                'hover:translate-x-1'
                                            }
                                        `}
                                    >
                                        <h2 className={`
                                            text-xl font-semibold transition-all duration-300 ease-out
                                            ${index === activeIndex ?
                                                'text-blue-600 opacity-100 transform scale-105' :
                                                'text-gray-600 opacity-80 hover:text-gray-800 hover:opacity-90'
                                            }
                                        `}>
                                            {service.title}
                                        </h2>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right column - Service description */}
                        <div className="w-full md:w-1/2 p-8 bg-gray-50">
                            <div className="sticky top-8">
                                <div className={`
                                    transition-all duration-300 ease-out
                                    ${isTransitioning ?
                                        'opacity-0 transform translate-y-4' :
                                        'opacity-100 transform translate-y-0'
                                    }
                                `}>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {services[activeIndex].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;