import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import projectsData from '@/utils/data.json';

export default function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">Projects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectsData.map((project: Project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <Link href={`/projects/${project.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                <div className="relative h-64 w-full">
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDQIEXqUNCwAAAABJRU5ErkJggg=="
                    />
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                    <div className="w-16 h-0.5 bg-black mb-4"></div>
                    <p className="text-gray-700 mb-4">{project.shortDescription}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};