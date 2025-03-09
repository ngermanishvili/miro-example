'use client';

import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import Hero from '../../components/Hero';
import Footer from '@/components/Footer';
import { Project, ProjectLanguageData } from '@/types/project';

// Define valid locale types
type ValidLocale = 'ka' | 'ru' | 'en';

// SWR fetcher
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Simple locale mapping function (client-safe)
function getLocaleKey(locale: string): ValidLocale {
  return locale === 'ka' ? 'ka' : locale === 'ru' ? 'ru' : 'en';
}

// Project card component
function ProjectCard({ project, locale }: { project: Project; locale: string }) {
  // Use client-safe locale mapping
  const localeKey = getLocaleKey(locale);
  const localeData = (project[localeKey] as ProjectLanguageData) || project.ge || project.en || {};

  if (!localeData) {
    return null;
  }

  return (
    <Link href={`/${locale}/projects/${project.id}`} prefetch={true}>
      <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64">
          {localeData.thumbnail && (
            <Image
              src={localeData.thumbnail}
              alt={localeData.title || ''}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{localeData.title || ''}</h2>
          <p className="text-gray-600 mb-2">{localeData.location || ''}</p>
          <p className="text-sm text-gray-500">
            {localeData.function || ''} | {localeData.area || ''} | {localeData.year || ''}
          </p>
        </div>
      </div>
    </Link>
  );
}

const Home: NextPage = () => {
  // Use Next.js pathname hook for SSR-compatible path detection
  const pathname = usePathname();

  // Use state to avoid hydration mismatch
  const [localeState, setLocaleState] = useState<{
    raw: string;
    typed: ValidLocale;
  }>({
    raw: 'en',
    typed: 'en'
  });

  // Set the locale after component mounts to avoid hydration mismatch
  useEffect(() => {
    if (pathname) {
      const segments = pathname.split('/');
      const rawLocale = segments[1] || 'en';
      const typedLocale = getLocaleKey(rawLocale);

      setLocaleState({
        raw: rawLocale,
        typed: typedLocale
      });
    }
  }, [pathname]);

  // Fetch projects from API
  const { data, error, isLoading } = useSWR<any>(
    `/api/projects`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  // Extract the projects array from the response
  const projects: Project[] = data?.projects || data || [];

  // Localized text with proper typing
  const pageTitle: Record<ValidLocale, string> = {
    ka: 'პროექტები',
    ru: 'Проекты',
    en: 'Projects'
  };

  const latestCreations: Record<ValidLocale, string> = {
    ka: 'ჩვენი უახლესი ქმნილებები',
    ru: 'Наши последние творения',
    en: 'Our latest creations'
  };

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
            <h2 className="text-3xl mb-4 font-bold text-gray-900">
              {pageTitle[localeState.typed]}
            </h2>
            <h3 className="text-xl text-gray-600">
              {latestCreations[localeState.typed]}
            </h3>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32 text-red-500">
            <div>
              <p className="font-bold">Error loading projects:</p>
              <p>{error.message}</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">No projects found. Please check your API endpoint.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} locale={localeState.raw} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Home;