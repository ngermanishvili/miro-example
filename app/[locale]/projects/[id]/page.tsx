import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, mapLocale } from '@/services/projectService';
import { SupportedLocale, ProjectLanguageData } from '@/types/project';
import { notFound } from 'next/navigation';

interface Params {
    locale: SupportedLocale;
    id: string;
}

interface PageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: PageProps) {
    // In Next.js 15, params should be awaited before using its properties
    const resolvedParams = await params;
    const { locale, id } = resolvedParams;

    const project = await getProjectById(id);

    if (!project) {
        return {
            title: 'Project Not Found',
        };
    }

    const localeKey = mapLocale(locale);
    const projectData: ProjectLanguageData = (project[localeKey] as ProjectLanguageData) || project.ge;

    return {
        title: projectData.title,
        description: projectData.shortDescription,
    };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    // In Next.js 15, params should be awaited before using its properties
    const resolvedParams = await params;
    const { locale, id } = resolvedParams;

    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    const localeKey = mapLocale(locale);
    const projectData: ProjectLanguageData = (project[localeKey] as ProjectLanguageData) || project.ge;

    return (
        <div className="h-screen w-full flex flex-col md:flex-row mt-24">
            {/* Left Panel - პროექტის ინფორმაცია */}
            <div className="w-full md:w-[30%] h-full border-r border-gray-200 overflow-y-auto">
                <div className="p-8">
                    <div className="pt-20 lg:pr-8 space-y-8">
                        {/* Back Button */}
                        <Link href={`/${locale}/projects`} prefetch={true}>
                            <div className="flex items-center text-gray-600 hover:text-black mb-8 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {locale === 'ka' ? 'პროექტებზე დაბრუნება' :
                                    locale === 'ru' ? 'Вернуться к проектам' :
                                        'Back to Projects'}
                            </div>
                        </Link>

                        {/* ძირითადი ინფორმაცია */}
                        <div className="space-y-6">
                            <div className="w-full">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 underline underline-offset-8">{projectData.title}</h1>
                            </div>

                            {/* Info Grid */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <p className="font-semibold">
                                        {locale === 'ka' ? 'მდებარეობა:' :
                                            locale === 'ru' ? 'РАСПОЛОЖЕНИЕ:' :
                                                'LOCATION:'}
                                    </p>
                                    <p>{projectData.location}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">
                                        {locale === 'ka' ? 'ფუნქცია:' :
                                            locale === 'ru' ? 'ФУНКЦИЯ:' :
                                                'FUNCTION:'}
                                    </p>
                                    <p>{projectData.function}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">
                                        {locale === 'ka' ? 'ფართობი:' :
                                            locale === 'ru' ? 'ПЛОЩАДЬ:' :
                                                'AREA:'}
                                    </p>
                                    <p>{projectData.area}</p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="font-semibold">
                                        {locale === 'ka' ? 'წელი:' :
                                            locale === 'ru' ? 'ГОД:' :
                                                'YEAR:'}
                                    </p>
                                    <p>{projectData.year}</p>
                                </div>
                            </div>
                        </div>

                        {/* აღწერა */}
                        <div className="space-y-4">
                            <h2 className="font-semibold">
                                {locale === 'ka' ? 'აღწერა:' :
                                    locale === 'ru' ? 'ОПИСАНИЕ:' :
                                        'DESCRIPTION:'}
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                {projectData.description.map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* პროგრამა / სართულები */}
                        <ProgrammeSection
                            floors={projectData.floors}
                            locale={locale}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel - სურათების გალერეა */}
            <div className="w-full md:w-[65%] h-full overflow-y-auto mt-24">
                <div className="p-8 space-y-8">
                    <ImageGallery images={projectData.images} />
                </div>
            </div>
        </div>
    );
}

// პროგრამის სექციის კომპონენტი
function ProgrammeSection({ floors, locale }: { floors: ProjectLanguageData['floors'], locale: SupportedLocale }) {
    return (
        <div className="space-y-8">
            {floors.map((floor, floorIdx) => (
                <div key={floorIdx} className="space-y-6">
                    {floor.name && <h3 className="font-semibold">{floor.name}</h3>}
                    {floor.image && (
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <Image
                                src={floor.image}
                                alt={floor.name || `Floor ${floorIdx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: "contain" }}
                                className="rounded-lg shadow-md"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                            />
                        </div>
                    )}
                    {floor.measurements && floor.measurements.length > 0 && floor.measurements[0] !== "" && (
                        <>
                            <h2 className="font-semibold text-xl md:text-2xl">
                                {locale === 'ka' ? 'პროგრამა:' :
                                    locale === 'ru' ? 'Программа:' :
                                        'Programme:'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {floor.measurements.map((measurement: string, idx: number) => (
                                    <div key={idx} className="text-gray-700 text-sm md:text-base">{measurement}</div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* დამატებული ახალი კოდი სართულის სურათების გამოსატანად */}
                    {floor.floorImages && floor.floorImages.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <h2 className="font-semibold text-xl md:text-2xl">
                                {locale === 'ka' ? 'სართულის ხედები:' :
                                    locale === 'ru' ? 'Виды этажа:' :
                                        'Floor Views:'}
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {floor.floorImages.map((image, imageIdx) => (
                                    <div key={imageIdx} className="relative w-full h-80">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            style={{ objectFit: "cover" }}
                                            className="rounded-lg shadow-md"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function ImageGallery({ images }: { images: ProjectLanguageData['images'] }) {
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
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                    />
                </div>
            ))}
        </>
    );
}