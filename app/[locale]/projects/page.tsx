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

  // SEO Titles based on language
  const title =
    locale === "ka" ? "პროექტები | Draftworks Project" :
      locale === "ru" ? "Проекты | Draftworks Project" :
        "Projects | Draftworks Project";

  // SEO Descriptions based on language
  const description =
    locale === "ka" ? "ნახეთ ჩვენი პროექტები და დარწმუნდით ჩვენს პროფესიონალიზმში. ჩვენ გთავაზობთ საუკეთესო არქიტექტურულ გადაწყვეტილებებს." :
      locale === "ru" ? "Ознакомьтесь с нашими проектами и убедитесь в нашем профессионализме. Мы предлагаем лучшие архитектурные решения." :
        "Explore our diverse architectural projects showcasing our expertise in design and construction. See our portfolio of successful architectural designs.";

  return {
    title,
    description,
    keywords: ['architecture projects', 'design portfolio', 'building designs', 'draftworks', 'architectural solutions'],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ka' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US',
      url: `https://draftworksproject.com/${locale}/projects`,
      siteName: 'Draftworks Project',
    },
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const projects = await getAllProjects();
  const localeKey = mapLocale(locale);

  return (
    <div className="container mx-auto py-8 mt-[120px]">
      <h1 className="text-3xl font-bold mb-8">
        {locale === "ka"
          ? "პროექტები"
          : locale === "ru"
            ? "Проекты"
            : "Projects"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-300">
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={thumbnailUrl}
                    alt={localeData.title || "Project thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={100}
                    priority
                    unoptimized={isLocalAsset}
                  />
                </div>

                {/* Space between image and separator */}
                <div className="h-3"></div>

                {/* Separator Line */}
                <div className="h-[2px] w-full bg-black"></div>

                {/* Content Container */}
                <div className="py-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-900 pl-1">
                      {localeData.title}
                    </h2>
                    <p className="text-sm text-gray-500 pr-4">{localeData.year}</p>
                  </div>
                  <p className="text-gray-600 pl-1">{localeData.location}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
