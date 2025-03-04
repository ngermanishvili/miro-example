import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import projectsData from '@/utils/data.json';
import { notFound } from 'next/navigation';

interface ProjectDetailPageProps {
    params: {
        id: string;
        locale: string;
    };
}

export async function generateStaticParams() {
    return projectsData.map((project: Project) => ({
        id: project.id,
    }));
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const project = projectsData.find((p: Project) => p.id === params.id);

    if (!project) {
        notFound();
    }

    return (
        <div className="h-screen w-full flex flex-col md:flex-row mt-24">
            {/* Left Panel */}
            <div className="w-full md:w-[35%] h-full border-r border-gray-200 overflow-y-auto">
                <div className="p-8">
                    <div className="pt-20 lg:pr-8 space-y-8">
                        {/* Back Button */}
                        <Link href={`/${params.locale}/projects`}>
                            <div className="flex items-center text-gray-600 hover:text-black mb-8 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Projects
                            </div>
                        </Link>

                        {/* Header Section */}
                        <div className="space-y-6">
                            <div className="w-full">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
                                <div className="w-[62%] h-0.5 bg-black"></div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex gap-2">
                                    <p className="font-semibold">LOCATION:</p>
                                    <p>{project.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">FUNCTION:</p>
                                    <p>{project.function}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">AREA:</p>
                                    <p>{project.area}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">YEAR:</p>
                                    <p>{project.year}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h2 className="font-semibold">DESCRIPTION:</h2>
                            <div className="space-y-4 text-gray-700">
                                {project.description.map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Programme Section */}
                        <div className="space-y-8">
                            <h2 className="font-semibold text-xl md:text-2xl">Programme:</h2>

                            {project.floors.map((floor, floorIdx) => (
                                <div key={floorIdx} className="space-y-6">
                                    <h3 className="font-semibold">{floor.name}</h3>
                                    <div className="relative w-full h-64">
                                        <Image
                                            src={floor.image}
                                            alt={floor.name}
                                            fill
                                            style={{ objectFit: "contain" }}
                                            className="rounded-lg shadow-md"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            {floor.measurements.slice(0, Math.ceil(floor.measurements.length / 2)).map((measurement, idx) => (
                                                <div key={`left-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            {floor.measurements.slice(Math.ceil(floor.measurements.length / 2)).map((measurement, idx) => (
                                                <div key={`right-${idx}`} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-[65%] h-full overflow-y-auto mt-4">
                <div className="p-8 space-y-8">
                    {project.images.map((image, idx) => (
                        <div key={idx} className="relative w-full h-96">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}