"use client"
import React, { useState, useRef, useEffect } from 'react';

interface Service {
    title: string;
    description: string;
}

const services: Service[] = [
    {
        title: "Building permit documentation",
        description: "A building permit is official approval from local authorities to begin construction, ensuring compliance with building codes and regulations. The process starts by defining building parameters, which includes a topographic survey, site evaluation, and documenting key factors like land use and environmental conditions. An initial sketch is often provided to show the building's footprint, height, and proximity to features like existing trees. This helps the municipality understand the project's scale. Once parameters are set, an application with detailed plans, including sections, elevations, and visualizations, is submitted. After approval, the permit grants authorization to start work, with inspections required throughout to ensure compliance."
    },
    {
        title: "Tender Documentation",
        description: "We provide a comprehensive set of drawings, BOQ (Bill of Quantities), schedules, specifications, and a coherent BIM (Building Information Modeling) models. The BIM model integrates all project data, including design, materials, and schedules, into a unified digital representation, ensuring consistency across all disciplines.This information is derived from our detailed design process, where we collaborate closely with structural, MEP, and other involved teams. We then consolidate this data into the BIM model, which serves as a central source of truth. This ensures all project details are aligned and up-to-date, supporting a smooth tendering process and effective project execution."
    },
    {
        title: "Scan to BIM Modeling",
        description: "We use 3D scanning to capture precise measurements and details of existing spaces or structures. The process involves using advanced laser scanners to create an accurate digital representation of the physical environment. Once the scan is complete, we convert the data into a BIM model, which allows us to create highly detailed, scalable 3D models. This method ensures that we capture every detail of the existing conditions, reducing errors and providing a solid foundation for design and renovation work. The 3D model then serves as a valuable tool for visualizing the project, coordinating with other disciplines, and streamlining the construction process."
    },
    {
        title: "BIM Modeling",
        description: "At our architecture firm, we offer BIM modeling services, working primarily from existing CAD drawings, 3D models, or any other relevant information. We integrate all available data into a detailed BIM model, tailored to the specific requirements of the project. Our team has extensive experience working with different Levels of Detail (LOD), which are determined based on the project phase—whether it's Concept Design, Schematic Design, Design Development, Construction Documentation, or an As-Built Model. Each LOD corresponds to the level of detail and accuracy needed at that stage of the project. This ensures that our models are aligned with the client's needs, enabling better coordination, visualization, and informed decision-making throughout the project lifecycle."
    },
    {
        title: "Interior design",
        description: "We provide interior design services tailored specifically to our client's needs. Our experienced designers work closely with clients to understand their vision, preferences, and functional requirements, ensuring the design reflects both style and practicality.From concept to completion, we create customized interior designs that suit the space, enhance user experience, and meet the project's objectives. Whether it's residential, commercial, or hospitality, our team ensures that every design detail aligns with the client's goals, delivering a cohesive and functional interior that stands out."
    },
    {
        title: "Architecture",
        description: "We provide architecture design services that are fully tailored to each client's needs. Our experienced architects work closely with clients to understand their vision and requirements, ensuring the design is both aesthetically pleasing and highly functional. We also incorporate structural engineering, utilities, and landscape design into our projects, offering a comprehensive approach that ensures all elements work together seamlessly. From concept to completion, we deliver designs that optimize space, enhance user experience, and meet the project's specific objectives, whether for residential, commercial, or public spaces."
    },
    {
        title: "Consulting / Technical support",
        description: "At our architecture firm, we not only provide architecture design services but also offer consulting and technical support throughout the project, tailored to its specific needs. Depending on the project's complexity, revision cycles, and communication requirements, our team is ready to offer guidance and technical expertise at every stage. Whether it's refining designs, coordinating with contractors, or addressing any technical challenges, we ensure our support is aligned with the project's demands. This flexibility ensures that all aspects of the project are handled efficiently, from initial concept through to final execution."
    }
];

export default function ServicesPage() {
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

    const handleServiceClick = (index: number) => {
        if (index === activeIndex) return;

        setIsTransitioning(true);
        setActiveIndex(index);
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center">
            <div className="flex h-[calc(100vh-12rem)] md:h-[70vh] w-full max-w-7xl mx-auto px-4">
                {/* Services Container */}
                <div
                    ref={containerRef}
                    className="flex flex-col md:flex-row h-full w-full shadow-xl border border-gray-100"
                >
                    {/* Services List */}
                    <div className="w-full md:w-1/2 pr-6 py-4 space-y-2 bg-white overflow-y-auto">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`
                                    py-4 px-6 cursor-pointer
                                    transform transition-all duration-300 ease-out
                                    rounded-lg mx-2
                                    ${index === activeIndex ? 'translate-x-1' : ''}
                                `}
                                onClick={() => handleServiceClick(index)}
                            >
                                <h2
                                    className={`
                                        text-xl font-semibold
                                        transition-all duration-300 ease-out
                                        ${index === activeIndex
                                            ? 'text-black opacity-100 transform scale-105'
                                            : 'text-gray-300 opacity-90'
                                        }
                                    `}
                                >
                                    {service.title}
                                </h2>
                            </div>
                        ))}
                    </div>

                    {/* Service Description */}
                    <div className="w-full md:w-1/2 p-8 bg-white overflow-y-auto">
                        <div>
                            <div
                                className={`
                                    transition-all duration-300 ease-out
                                    ${isTransitioning ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'}
                                `}
                            >
                                <h3 className="text-2xl font-bold text-black mb-4">
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
        </div>
    );
}