import React from "react";
import Image from "next/image";
import { SupportedLocale, ProjectLanguageData } from "@/types/project";

interface ProgrammeSectionProps {
  floors: ProjectLanguageData["floors"];
  locale: SupportedLocale;
}

// Improved URL validation function
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

export default function ProgrammeSection({
  floors,
  locale,
}: ProgrammeSectionProps) {
  // Filter floors with valid data
  const validFloors = floors?.filter((floor) => floor) || [];

  return (
    <div className="space-y-8">
      {validFloors.map((floor, floorIdx) => {
        const floorImage = floor.image ? getValidImageUrl(floor.image) : null;
        const isFloorImageLocal = floorImage?.startsWith("/assets") || false;

        return (
          <div key={floorIdx} className="space-y-6">
            {floor.name && <h3 className="font-semibold">{floor.name}</h3>}
            {floorImage && (
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image
                  src={floorImage}
                  alt={floor.name || `Floor ${floorIdx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                  className="rounded-lg shadow-md"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                  unoptimized={isFloorImageLocal}
                />
              </div>
            )}
            {floor.measurements &&
              floor.measurements.length > 0 &&
              floor.measurements[0] !== "" && (
                <>
                  <h2 className="font-semibold text-xl md:text-2xl">
                    {locale === "ka"
                      ? "პროგრამა:"
                      : locale === "ru"
                      ? "Программа:"
                      : "Programme:"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {floor.measurements.map(
                      (measurement: string, idx: number) => {
                        // Split by the first occurrence of "--" or " - " or similar separators
                        const parts = measurement.split(
                          /\s*--\s*|\s*-\s*|\s*–\s*|\s*—\s*/
                        );

                        if (parts.length > 1) {
                          return (
                            <div
                              key={idx}
                              className="text-gray-700 text-sm md:text-base"
                            >
                              <span className="font-bold">{parts[0]}</span> --{" "}
                              {parts.slice(1).join(" ")}
                            </div>
                          );
                        } else {
                          // If there's no separator, just render the whole text
                          return (
                            <div
                              key={idx}
                              className="text-gray-700 text-sm md:text-base"
                            >
                              {measurement}
                            </div>
                          );
                        }
                      }
                    )}
                  </div>
                </>
              )}

            {/* დამატებული ახალი კოდი სართულის სურათების გამოსატანად */}
            {floor.floorImages && floor.floorImages.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="font-semibold text-xl md:text-2xl">
                  {locale === "ka"
                    ? "სართულის ხედები:"
                    : locale === "ru"
                    ? "Виды этажа:"
                    : "Floor Views:"}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {floor.floorImages
                    .filter(
                      (image) => image && image.src && isValidUrl(image.src)
                    )
                    .map((image, imageIdx) => {
                      const imageSrc = getValidImageUrl(image.src);
                      const isLocalImage = imageSrc.startsWith("/assets");

                      return (
                        <div key={imageIdx} className="relative w-full h-80">
                          <Image
                            src={imageSrc}
                            alt={
                              image.alt ||
                              `Floor ${floorIdx + 1} view ${imageIdx + 1}`
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: "cover" }}
                            className="rounded-lg shadow-md"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                            unoptimized={isLocalImage}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
