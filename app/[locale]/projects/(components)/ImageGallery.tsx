import React from 'react';
import Image from 'next/image';
import { ProjectLanguageData } from '@/types/project';

interface ImageGalleryProps {
    images: ProjectLanguageData['images'];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    // თუ სურათები არ არის
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8 mt-8">
            {/* პირველი სურათი - დიდი, სრული სიგანის */}
            {images.length > 0 && (
                <div className="relative w-full aspect-[16/9] mb-8">
                    <Image
                        src={images[0].src}
                        alt={images[0].alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 75vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-lg shadow-lg"
                        priority  // პირველი სურათი მნიშვნელოვანია, ამიტომ priority
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                    />
                </div>
            )}

            {/* დანარჩენი სურათები - 2 სვეტად */}
            {images.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.slice(1).map((image, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-[4/3] transition-transform duration-300 hover:translate-y-[-5px]"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 35vw"
                                style={{ objectFit: "cover" }}
                                className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAKJJHagMgAAAABJRU5ErkJggg=="
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}