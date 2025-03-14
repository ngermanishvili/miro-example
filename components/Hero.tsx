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
        <>
            <div className="w-full flex justify-center mt-[50px]">
                <section className="relative h-[75vh] w-full max-w-[900px] mt-[120px] border-8 border-black p-4">
                    <div className="w-full h-full relative overflow-hidden">
                        <Image
                            src="/assets/giphy-main-animation.gif" // Update this path to your actual GIF location
                            alt="Hero animation"
                            fill
                            objectFit="cover"
                            priority
                            className="absolute w-full h-full"
                        />
                    </div>
                </section>
            </div>
            <span className='text-black text-2xl font-bold flex items-center justify-center py-8 text-center px-4 mt-4'>
                {heroText[locale]}
            </span>
        </>
    );
};

export default Hero;