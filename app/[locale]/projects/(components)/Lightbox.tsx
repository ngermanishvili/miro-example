"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
    images: {
        src: string;
        alt?: string;
    }[];
    currentIndex: number;
    onClose: () => void;
}

const Lightbox = ({ images, currentIndex, onClose }: LightboxProps) => {
    const [index, setIndex] = useState(currentIndex);

    // Close lightbox when Escape key is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const nextImage = () => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Prevent scrolling when lightbox is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={onClose}
            >
                <X className="w-8 h-8" />
            </button>

            <button
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                onClick={prevImage}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full max-w-4xl max-h-screen p-8 flex items-center justify-center">
                <div className="relative w-full h-full">
                    <Image
                        src={images[index].src}
                        alt={images[index].alt || `Image ${index + 1}`}
                        fill
                        style={{ objectFit: "contain" }}
                        quality={100}
                    />
                </div>
            </div>

            <button
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                onClick={nextImage}
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
};

export default Lightbox; 