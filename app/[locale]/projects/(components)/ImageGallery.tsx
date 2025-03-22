"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProjectLanguageData } from "@/types/project";
import Lightbox from "./Lightbox";

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter out images with invalid URLs to prevent rendering errors
  const validImages =
    images?.filter((img) => img && img.src && isValidUrl(img.src)) || [];

  // Format images for lightbox
  const lightboxImages = validImages.map(img => ({
    src: getValidImageUrl(img.src),
    alt: img.alt || ""
  }));

  // თუ სურათები არ არის
  if (validImages.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className="space-y-8 mt-8 overflow-y-auto h-[calc(100vh-120px)]">
        {/* ყველა სურათი - ვერტიკალურად ერთ სვეტად */}
        {validImages.map((image, idx) => {
          const imageSrc = getValidImageUrl(image.src);
          const isLocalAsset = imageSrc.startsWith("/assets");

          return (
            <div
              key={idx}
              className="relative w-full mb-8 cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={imageSrc}
                  alt={image.alt || `Project image ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 67vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:opacity-90"
                  loading={idx === 0 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                  unoptimized={isLocalAsset}
                />
              </div>
            </div>
          );
        })}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
