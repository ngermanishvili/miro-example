import React from "react";
import Image from "next/image";
import { ProjectLanguageData } from "@/types/project";

interface ImageGalleryProps {
  images: ProjectLanguageData["images"];
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

export default function ImageGallery({ images }: ImageGalleryProps) {
  // Filter out images with invalid URLs to prevent rendering errors
  const validImages =
    images?.filter((img) => img && img.src && isValidUrl(img.src)) || [];

  // თუ სურათები არ არის
  if (validImages.length === 0) {
    return null;
  }

  const firstImageSrc = getValidImageUrl(validImages[0].src);
  const isFirstLocalAsset = firstImageSrc.startsWith("/assets");

  return (
    <div className="space-y-8 mt-8">
      {/* პირველი სურათი - დიდი, სრული სიგანის */}
      {validImages.length > 0 && (
        <div className="relative w-full aspect-[16/9] mb-8">
          <Image
            src={firstImageSrc}
            alt={validImages[0].alt || "Project image"}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            style={{ objectFit: "cover" }}
            className="rounded-lg shadow-lg"
            priority // პირველი სურათი მნიშვნელოვანია, ამიტომ priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
            unoptimized={isFirstLocalAsset}
          />
        </div>
      )}

      {/* დანარჩენი სურათები - 2 სვეტად */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {validImages.slice(1).map((image, idx) => {
            const imageSrc = getValidImageUrl(image.src);
            const isLocalAsset = imageSrc.startsWith("/assets");

            return (
              <div
                key={idx}
                className="relative aspect-[4/3] transition-transform duration-300 hover:translate-y-[-5px]"
              >
                <Image
                  src={imageSrc}
                  alt={image.alt || `Project image ${idx + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                  unoptimized={isLocalAsset}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
