import { getAllProjects, mapLocale } from '@/services/projectService';
import Link from 'next/link';
import Image from 'next/image';
import { Project, SupportedLocale, ProjectLanguageData } from '@/types/project';
import { Metadata } from 'next';

interface Params {
    locale: SupportedLocale;
}

interface PageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    return {
        title: locale === 'ka' ? 'პროექტები' : locale === 'ru' ? 'Проекты' : 'Projects',
    };
}

export default async function ProjectsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    const projects = await getAllProjects();
    const localeKey = mapLocale(locale);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">
                {locale === 'ka' ? 'პროექტები' : locale === 'ru' ? 'Проекты' : 'Projects'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                    const localeData: ProjectLanguageData = (project[localeKey] as ProjectLanguageData) || project.ge;

                    return (
                        <Link
                            key={project.id}
                            href={`/${locale}/projects/${project.id}`}
                            className="block group"
                        >
                            <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-64">
                                    <Image
                                        src={localeData.thumbnail}
                                        alt={localeData.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{localeData.title}</h2>
                                    <p className="text-gray-600 mb-2">{localeData.location}</p>
                                    <p className="text-sm text-gray-500">
                                        {localeData.function} | {localeData.area} | {localeData.year}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}