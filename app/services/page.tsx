"use client"
import React, { useState, useRef, useEffect } from 'react';

interface Service {
    title: string;
    description: string;
}

interface ServicesContainerProps {
    className?: string;
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

const ServicesContainer: React.FC<ServicesContainerProps> = ({ className = '' }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wheelDebounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleWheel = (e: WheelEvent): void => {
            e.preventDefault();

            if (isTransitioning) return;

            if (wheelDebounceRef.current) {
                clearTimeout(wheelDebounceRef.current);
            }

            wheelDebounceRef.current = setTimeout(() => {
                if (e.deltaY > 0) {
                    if (activeIndex < services.length - 1) {
                        setIsTransitioning(true);
                        setActiveIndex(prev => prev + 1);
                    }
                } else {
                    if (activeIndex > 0) {
                        setIsTransitioning(true);
                        setActiveIndex(prev => prev - 1);
                    }
                }
            }, 20);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
            if (wheelDebounceRef.current) {
                clearTimeout(wheelDebounceRef.current);
            }
        };
    }, [services.length, activeIndex, isTransitioning]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [activeIndex]);

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-32">
            {/* Hero Image */}
            <div className="mb-16 w-full max-w-md relative">
                <div className="aspect-square w-full relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                        src="/api/placeholder/800/800"
                        alt="Services Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                    <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white">
                        Our Services
                    </h1>
                </div>
            </div>

            {/* Services Container */}
            <div
                ref={containerRef}
                className={`flex h-96 w-full bg-gray-500 shadow-xl rounded-2xl overflow-hidden border border-gray-100 ${className}`}
            >
                {/* სერვისების სია */}
                <div className="w-1/2 pr-6 py-4 space-y-2 bg-blue-100">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`
                                py-4 px-6 cursor-pointer
                                transform transition-all duration-300 ease-out
                                hover:bg-transparent
                                rounded-lg mx-2
                                ${index === activeIndex ? 'bg-transparent translate-x-1' : ''}
                            `}
                            onClick={() => {
                                setIsTransitioning(true);
                                setActiveIndex(index);
                            }}
                        >
                            <h2
                                className={`
                                    text-xl font-semibold
                                    transition-all duration-300 ease-out
                                    ${index === activeIndex
                                        ? 'text-blue-600 opacity-100 transform scale-105'
                                        : 'text-black opacity-90 hover:text-blue-800 hover:opacity-100'
                                    }
                                `}
                            >
                                {service.title}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* სერვისის აღწერა */}
                <div className="w-1/2 p-8 bg-white">
                    <div className="sticky top-8">
                        <div
                            className={`
                                transition-all duration-300 ease-out
                                ${isTransitioning ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'}
                            `}
                        >
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">
                                {services[activeIndex].title}
                            </h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {services[activeIndex].description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesContainer;