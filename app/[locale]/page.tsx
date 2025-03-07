'use client';

import type { NextPage } from 'next';
import React, { Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import Hero from '../../components/Hero';
import Footer from '@/components/Footer';
import { Project } from '@/types/project';

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Project skeleton placeholders
function ProjectSkeletons({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-4">
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-200 animate-pulse">
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  );
}

// Project card component
function ProjectCard({ project, locale }: { project: Project; locale: string }) {
  return (
    <Link href={`/${locale}/projects/${project.id}`} prefetch={true}>
      <div className="flex flex-col gap-4">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="text-start">
          <h4 className="text-lg font-semibold text-gray-800">{project.title}</h4>
          <p className="text-gray-600 mt-2">{project.location}</p>
        </div>
      </div>
    </Link>
  );
}

const Home: NextPage = () => {
  // Get locale from URL
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

  // Fetch projects from API using SWR
  const { data, error, isLoading } = useSWR<{ projects: Project[] }>(
    `/${locale}/api/projects`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  // Extract the projects array from the response
  const projects = data?.projects || [];

  return (
    <>
      <Head>
        <title>Miro Template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <section id="projects" className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <div className="text-right">
            <h2 className="text-3xl mb-4 font-bold text-gray-900">Projects</h2>
            <h3 className="text-xl text-gray-600">Our latest creations</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ProjectSkeletons count={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ProjectSkeletons count={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ProjectSkeletons count={2} />
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32 text-red-500">
            Error loading projects: {error.message}
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {/* First row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {projects.slice(2, 4).map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>

            {/* Third row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {projects.slice(4, 6).map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;