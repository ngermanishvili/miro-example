'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import { notFound } from 'next/navigation';
import useSWR from 'swr'; // yarn add swr ან npm install swr

// მარტივი ჩამტვირთველი კომპონენტი
const Loader = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);

// მარტივი fetcher ფუნქცია SWR-ისთვის
const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
});

interface ProjectParams {
    id: string;
    locale: string;
}

interface ProjectDetailPageProps {
    params: Promise<ProjectParams> | ProjectParams;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const resolvedParams = React.use(params as any) as ProjectParams;
    const { id, locale } = resolvedParams;

    // SWR გამოყენება მონაცემების ქეშირებისთვის და ხელახალი ჩატვირთვისთვის
    const { data: project, error, isLoading } = useSWR<Project>(
        `/api/projects/${id}`,
        fetcher,
        {
            revalidateOnFocus: false, // არ გადატვირთო ფოკუსისას
            dedupingInterval: 60000, // 1 წუთი
        }
    );

    // ჩვენება დატვირთვის დროს
    if (isLoading) {
        return <Loader />;
    }

    // ჩვენება შეცდომის დროს
    if (error || !project) {
        return notFound();
    }

    return (
        <div className="h-screen w-full flex flex-col md:flex-row mt-24">
            {/* Left Panel - ოპტიმიზებული */}
            <div className="w-full md:w-[45%] h-full border-r border-gray-200 overflow-y-auto">
                <div className="p-8">
                    <div className="pt-20 lg:pr-8 space-y-8">
                        {/* Back Button - ოპტიმიზებული */}
                        <Link href={`/${locale}/projects`} prefetch={true}>
                            <div className="flex items-center text-gray-600 hover:text-black mb-8 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Projects
                            </div>
                        </Link>

                        {/* ძირითადი ინფორმაცია */}
                        <div className="space-y-6">
                            <div className="w-full">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 underline underline-offset-8">{project.title}</h1>
                            </div>

                            {/* Info Grid - გამარტივებული */}
                            <div className="space-y-2">
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

                        {/* აღწერა */}
                        <div className="space-y-4">
                            <h2 className="font-semibold">DESCRIPTION:</h2>
                            <div className="space-y-4 text-gray-700">
                                {project.description.map((paragraph: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: React.Key | null | undefined) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* პროგრამა - ლეივი ჩატვირთვა */}
                        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
                            <ProgrammeSection floors={project.floors} />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Right Panel - ლეივი ჩატვირთვა სურათებისთვის */}
            <div className="w-full md:w-[65%] h-full overflow-y-auto mt-4">
                <div className="p-8 space-y-8">
                    <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
                        <ImageGallery images={project.images} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// გამოყოფილი კომპონენტები ლეივი ჩატვირთვისთვის
function ProgrammeSection({ floors }: { floors: any[] }) {
    return (
        <div className="space-y-8">
            {floors.map((floor, floorIdx) => (
                <div key={floorIdx} className="space-y-6">
                    {floor.name && <h3 className="font-semibold">{floor.name}</h3>}
                    {floor.image && (
                        <div className="relative w-full h-64">
                            <Image
                                src={floor.image}
                                alt={floor.name || `Floor ${floorIdx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: "contain" }}
                                className="rounded-lg shadow-md"
                                loading="lazy" // ლეივი ჩატვირთვა
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                            />
                        </div>
                    )}
                    {floor.measurements && floor.measurements.length > 0 && floor.measurements[0] !== "" && (
                        <>
                            {/* <h2 className="font-semibold text-xl md:text-2xl">Programme:</h2> */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {floor.measurements.map((measurement: string, idx: number) => (
                                    <div key={idx} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
    return (
        <>
            {images.map((image, idx) => (
                <div key={idx} className="relative w-full h-96">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 65vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-lg shadow-md"
                        loading="lazy" // ლეივი ჩატვირთვა
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                    />
                </div>
            ))}
        </>
    );
}