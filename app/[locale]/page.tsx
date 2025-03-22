"use client";

import type { NextPage } from "next";
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import { Project, ProjectLanguageData } from "@/types/project";
import LoadingAnimation from "@/components/LoadingAnimation";
import { ArrowDownCircle } from "lucide-react";

// Define valid locale types
export type SupportedLocale = "en" | "ka" | "ru";

// Fetch projects data
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Map locale to the correct key in Project object
function mapLocale(locale: SupportedLocale): keyof Project {
  switch (locale) {
    case 'ka':
      return 'ge';
    case 'ru':
      return 'ru';
    case 'en':
      return 'en';
    default:
      return 'ge'; // Default to Georgian
  }
}

interface ProjectCardProps {
  project: Project;
  locale: SupportedLocale;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, locale }) => {
  // Map locale to the correct property name in the project object
  const localeKey = mapLocale(locale);

  // Get the localized data safely
  const data = project[localeKey] as ProjectLanguageData;

  // If we don't have data, skip rendering
  if (!data || !data.title) {
    return null;
  }

  // Safely get the main image
  let mainImage = "/placeholder.jpg"; // Default fallback

  if (data.thumbnail) {
    mainImage = data.thumbnail;
  } else if (data.images && data.images.length > 0 && data.images[0].src) {
    mainImage = data.images[0].src;
  }

  return (
    <Link href={`/${locale}/projects/${project.id}`}>
      <div className="group overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-300">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden">
          <Image
            src={mainImage}
            alt={data.title || "Project"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Space between image and separator */}
        <div className="h-3"></div>

        {/* Separator Line */}
        <div className="h-[2px] w-full bg-black"></div>

        {/* Content Container - aligned with the separator line */}
        <div className="py-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-gray-900 pl-1">{data.title}</h3>
            <p className="text-sm text-gray-500 pr-4">{data.year}</p>
          </div>
          <p className="text-gray-600 pl-1">{data.location}</p>
        </div>
      </div>
    </Link>
  );
};

const Home: NextPage = () => {
  const params = useParams();
  const locale = params?.locale as string || "ka";
  const projectsRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Set initial loading state to true - will be updated in useEffect
  const [loading, setLoading] = useState(true);
  const [localeState, setLocaleState] = useState({
    raw: "en" as SupportedLocale,
    typed: "en" as keyof typeof pageTitle,
  });

  // Get current pathname and extract locale
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Extract locale from path
    const pathParts = pathname.split("/");
    const localeFromPath = pathParts[1] as SupportedLocale;

    // Check if it's a valid locale, otherwise default to 'en'
    if (["en", "ka", "ru"].includes(localeFromPath)) {
      setLocaleState({
        raw: localeFromPath,
        typed: localeFromPath as keyof typeof pageTitle,
      });
    } else {
      setLocaleState({
        raw: "en",
        typed: "en",
      });
    }

    // End loading after locale is determined
    setLoading(false);
  }, [pathname]);

  // Fetch projects data
  const { data: projects = [], error } = useSWR<Project[]>(
    "/api/projects",
    fetcher
  );

  // Static texts
  const pageTitle = {
    en: "Our Projects",
    ka: "ჩვენი პროექტები",
    ru: "Наши проекты",
  };

  const latestCreations = {
    ka: "ჩვენი უახლესი შედევრები",
    ru: "Наши последние творения",
    en: "Our latest creations",
  };

  return (
    <div>
      <Head>
        <title>Draftworks Project</title>
        <meta
          name="description"
          content="Professional architecture and design"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Loading animation */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
          >
            <LoadingAnimation onComplete={() => setLoading(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <main className="min-h-screen">
              {/* Hero Section */}
              <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
                <div className="w-full flex justify-center items-center flex-1">
                  <Hero />
                </div>

              </div>

              {/* Projects Preview Section */}
              <div ref={projectsRef}>
                <section id="projects" className="container mx-auto px-4 py-16">
                  <div className="flex justify-end mb-8">
                    <div className="text-right">
                      <h2 className="text-3xl mb-4 font-bold text-gray-900">
                        {pageTitle[localeState.typed]}
                      </h2>
                      <p className="text-xl text-gray-600">
                        {latestCreations[localeState.typed]}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects && projects.length > 0 ? (
                      projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          locale={localeState.raw}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-10">
                        <p className="text-gray-500">
                          {locale === "ka" ? "პროექტები ვერ მოიძებნა" :
                            locale === "ru" ? "Проекты не найдены" :
                              "No projects found"}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
