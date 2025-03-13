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
  const projectData: ProjectLanguageData =
    (project[localeKey] as ProjectLanguageData) || project.ge;

  // შევამოწმოთ არის თუ არა crafts-school პროექტი
  const isCraftsSchool = id === "crafts-school";

  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:flex-row">
        {/* Left Panel - პროექტის ინფორმაცია - ფიქსირებული სიმაღლით და სქროლით */}
        <div className="w-full lg:w-1/3 mt-8 border-r border-gray-200 pt-24 z-0 lg:h-[100vh] lg:overflow-y-auto">
          <div className="p-6 lg:p-8 pb-24">
            <div className="pr-2 space-y-8">
              {/* Back Button */}
              <Link href={`/${locale}/projects`} prefetch={true}>
                <div className="flex items-center text-gray-600 hover:text-black mb-8 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {locale === "ka"
                    ? "პროექტებზე დაბრუნება"
                    : locale === "ru"
                    ? "Вернуться к проектам"
                    : "Back to Projects"}
                </div>
              </Link>

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

        {/* Right Panel - სურათების გალერეა - უფრო დიდი სივრცე */}
        <div className="w-full lg:w-2/3 pt-24">
          <div className="p-4 lg:p-6">
            <ImageGallery images={projectData.images} />
          </div>
        </div>
      </div>
    </>
  );
}
