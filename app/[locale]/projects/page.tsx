import { getAllProjects, mapLocale } from "@/services/projectService";
import Link from "next/link";
import Image from "next/image";
import { Project, SupportedLocale, ProjectLanguageData } from "@/types/project";
import { Metadata } from "next";

interface Params {
  locale: SupportedLocale;
}

interface PageProps {
  params: Promise<Params>;
}

// Improved URL validation
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;

  // Check for absolute URLs (http:// or https://)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Check for valid relative URLs (must start with /)
  return url.startsWith("/");
};

// Get a valid image URL or return a placeholder
const getValidImageUrl = (url: string | null | undefined): string => {
  if (!url) return "/assets/placeholder.jpg";
  if (isValidUrl(url)) return url;
  // If URL doesn't start with /, add it (assuming it's a relative path)
  if (!url.startsWith("/")) return `/${url}`;
  return "/assets/placeholder.jpg";
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  return {
    title:
      locale === "ka" ? "პროექტები" : locale === "ru" ? "Проекты" : "Projects",
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
        {locale === "ka"
          ? "პროექტები"
          : locale === "ru"
          ? "Проекты"
          : "Projects"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const localeData: ProjectLanguageData =
            (project[localeKey] as ProjectLanguageData) || project.ge;

          const thumbnailUrl = getValidImageUrl(localeData.thumbnail);
          const isLocalAsset = thumbnailUrl.startsWith("/assets");

          return (
            <Link
              key={project.id}
              href={`/${locale}/projects/${project.id}`}
              className="block group"
            >
              <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={thumbnailUrl}
                    alt={localeData.title || "Project thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: "cover" }}
                    quality={100}
                    priority
                    unoptimized={isLocalAsset}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {localeData.title}
                  </h2>
                  <p className="text-gray-600 mb-2">{localeData.location}</p>
                  <p className="text-sm text-gray-500">
                    {localeData.function} | {localeData.area} |{" "}
                    {localeData.year}
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
