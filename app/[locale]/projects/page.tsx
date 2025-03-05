'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import useSWR from 'swr';

// ლოადერი
const Loader = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
);

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface LocaleParams {
    locale: string;
}

interface ProjectsPageProps {
    params: Promise<LocaleParams> | LocaleParams;
}

export default function ProjectsPage({ params }: ProjectsPageProps) {
    const resolvedParams = React.use(params as any) as LocaleParams;
    const { locale } = resolvedParams;

    // SWR გამოყენება მონაცემების ქეშირებისთვის
    const { data: projects, error, isLoading } = useSWR<Project[]>(
        `/api/projects`,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 წუთი
        }
    );

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-16 mt-20">
            <h1 className="text-3xl font-bold mb-10">Projects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Suspense fallback={<ProjectSkeletons count={6} />}>
                    {projects?.map((project) => (
                        <ProjectCard key={project.id} project={project} locale={locale} />
                    ))}
                </Suspense>
            </div>
        </div>
    );
}

// ოპტიმიზებული პროექტის ბარათი
function ProjectCard({ project, locale }: { project: Project; locale: string }) {
    return (
        <Link href={`/${locale}/projects/${project.id}`} prefetch={true}>
            <div className="group cursor-pointer transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-gray-200 h-full">
                <div className="relative h-64 w-full overflow-hidden">
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                    <p className="text-gray-600 mb-3">{project.location}</p>
                    <p className="text-sm text-gray-500">{project.shortDescription}</p>
                </div>
            </div>
        </Link>
    );
}

// პლეისჰოლდერები ჩატვირთვის დროს
function ProjectSkeletons({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 animate-pulse">
                    <div className="bg-gray-200 h-64 w-full"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </>
    );
}