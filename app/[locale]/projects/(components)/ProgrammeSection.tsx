import React from "react";
import Image from "next/image";
import { SupportedLocale, ProjectLanguageData } from "@/types/project";

interface ProgrammeSectionProps {
  floors: ProjectLanguageData["floors"];
  locale: SupportedLocale;
}

export default function ProgrammeSection({
  floors,
  locale,
}: ProgrammeSectionProps) {
  return (
    <div className="space-y-8">
      {floors.map((floor, floorIdx) => (
        <div key={floorIdx} className="space-y-6">
          {floor.name && <h3 className="font-semibold">{floor.name}</h3>}
          {floor.image && floor.image.startsWith("http") && (
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={floor.image}
                alt={floor.name || `Floor ${floorIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                className="rounded-lg shadow-md"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
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
                {floor.floorImages.map(
                  (image, imageIdx) =>
                    image.src &&
                    image.src.startsWith("http") && (
                      <div key={imageIdx} className="relative w-full h-80">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                          className="rounded-lg shadow-md"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
