import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjectById, mapLocale } from "@/services/projectService";
import { SupportedLocale, ProjectLanguageData } from "@/types/project";
import { notFound } from "next/navigation";
import ProgrammeSection from "../(components)/ProgrammeSection";
import ImageGallery from "../(components)/ImageGallery";
import { formatCraftsSchoolDescription } from "@/utils/formatter";

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
      title: "Project Not Found",
    };
  }

  const localeKey = mapLocale(locale);
  const projectData: ProjectLanguageData =
    (project[localeKey] as ProjectLanguageData) || project.ge;

  // Get a valid image URL for OpenGraph
  const findFirstValidImage = () => {
    if (projectData.images && projectData.images.length > 0) {
      const firstImage = projectData.images[0];
      if (firstImage && firstImage.src) {
        if (firstImage.src.startsWith('http')) {
          return firstImage.src;
        } else {
          return `https://draftworksproject.com${firstImage.src.startsWith('/') ? '' : '/'}${firstImage.src}`;
        }
      }
    }
    return 'https://draftworksproject.com/assets/placeholder.jpg';
  };

  return {
    title: `${projectData.title} | Draftworks Project`,
    description: Array.isArray(projectData.description)
      ? projectData.description.slice(0, 2).join(' ').substring(0, 160) + '...'
      : projectData.shortDescription || 'Architectural project by Draftworks Project',
    keywords: [
      'architecture',
      'design',
      projectData.function || 'building',
      projectData.location || 'georgia',
      'draftworks'
    ],
    openGraph: {
      title: projectData.title,
      description: Array.isArray(projectData.description)
        ? projectData.description.slice(0, 1).join(' ').substring(0, 200) + '...'
        : projectData.shortDescription || 'Architectural project by Draftworks Project',
      type: 'article',
      locale: locale === 'ka' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US',
      url: `https://draftworksproject.com/${locale}/projects/${id}`,
      siteName: 'Draftworks Project',
      images: [
        {
          url: findFirstValidImage(),
          width: 1200,
          height: 630,
          alt: projectData.title
        }
      ]
    }
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
  const projectData: ProjectLanguageData =
    (project[localeKey] as ProjectLanguageData) || project.ge;

  // შევამოწმოთ არის თუ არა crafts-school პროექტი
  const isCraftsSchool = id === "crafts-school";

  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:flex-row pt-24">
        <div className="container mx-auto px-0 flex flex-col lg:flex-row w-full">
          {/* Left Panel - პროექტის ინფორმაცია - ფიქსირებული სიმაღლით და სქროლით */}
          <div className="w-full lg:w-1/2 border-r border-gray-200 z-0 lg:h-[calc(100vh-96px)] lg:overflow-y-auto">
            <div className="px-[-10px] py-4 pb-24">
              <div className="space-y-8">


                {/* ძირითადი ინფორმაცია */}
                <div className="space-y-6">
                  <div className="w-full">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 underline underline-offset-8">
                      {projectData.title}
                    </h1>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <p className="font-semibold">
                        {locale === "ka"
                          ? "მდებარეობა:"
                          : locale === "ru"
                            ? "РАСПОЛОЖЕНИЕ:"
                            : "LOCATION:"}
                      </p>
                      <p>{projectData.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-semibold">
                        {locale === "ka"
                          ? "ფუნქცია:"
                          : locale === "ru"
                            ? "ФУНКЦИЯ:"
                            : "FUNCTION:"}
                      </p>
                      <p>{projectData.function}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-semibold">
                        {locale === "ka"
                          ? "ფართობი:"
                          : locale === "ru"
                            ? "ПЛОЩАДЬ:"
                            : "AREA:"}
                      </p>
                      <p>{projectData.area}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-semibold">
                        {locale === "ka"
                          ? "წელი:"
                          : locale === "ru"
                            ? "ГОД:"
                            : "YEAR:"}
                      </p>
                      <p>{projectData.year}</p>
                    </div>
                  </div>
                </div>

                {/* აღწერა */}
                <div className="space-y-4">
                  <h2 className="font-semibold">
                    {locale === "ka"
                      ? "აღწერა:"
                      : locale === "ru"
                        ? "ОПИСАНИЕ:"
                        : "DESCRIPTION:"}
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    {isCraftsSchool ? (
                      // თუ craft-school პროექტია, გამოვიყენოთ ფორმატირება
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatCraftsSchoolDescription(
                            projectData.description
                          ).join(""),
                        }}
                      />
                    ) : (
                      // სხვა შემთხვევაში სტანდარტული გამოტანა
                      projectData.description.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    )}
                  </div>
                </div>

                {/* პროგრამა / სართულები */}
                <ProgrammeSection floors={projectData.floors} locale={locale} />
              </div>
            </div>
          </div>

          {/* Right Panel - სურათების გალერეა */}
          <div className="w-full lg:w-2/3">
            <div className="px-4 py-4">
              <ImageGallery images={projectData.images} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
