"use client"
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Define valid locale types
type ValidLocale = "ka" | "ru" | "en";

// Helper function to extract locale from pathname
function getLocaleFromPathname(pathname: string): ValidLocale {
    const segments = pathname.split('/');
    const locale = segments[1];
    return locale === "ka" ? "ka" : locale === "ru" ? "ru" : "en";
}

const Hero = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname);

    // Define translations for the hero text
    const heroText: Record<ValidLocale, string> = {
        en: "We provide tailored architecture and design solutions, combining expertise, innovation, and seamless collaboration to bring your vision to life.",
        ka: "ჩვენ გთავაზობთ მორგებულ არქიტექტურულ და დიზაინის გადაწყვეტილებებს, ვაერთიანებთ გამოცდილებას, ინოვაციას და უწყვეტ თანამშრომლობას თქვენი ხედვის განსახორციელებლად.",
        ru: "Мы предоставляем индивидуальные архитектурные и дизайнерские решения, сочетая профессионализм, инновации и безупречное сотрудничество для воплощения вашего видения в жизнь."
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[1200px] px-4 mt-[50px]">
            {/* Animation container */}
            <div className="w-full flex justify-center mb-8">
                {/* Outer frame with border */}
                <div className="relative w-full md:w-[1000px] lg:w-[1400px] h-[250px] sm:h-[350px] md:h-[450px] border-[8px] md:border-[16px] border-black overflow-hidden">
                    {/* Inner content with padding */}
                    <div className="absolute inset-0 px-[50px] sm:px-[100px] md:px-[150px] lg:px-[250px] py-[10px] md:py-[20px]">
                        {/* Image container */}
                        <div className="relative w-full h-full">
                            <Image
                                src="/assets/giphy-main-animation.gif"
                                alt="Hero animation"
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Text below animation */}
            <div className="w-full max-w-3xl text-center px-4">
                <p className="text-black text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    {heroText[locale]}
                </p>
            </div>
        </div>
    );
};

export default Hero;