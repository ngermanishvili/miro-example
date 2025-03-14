"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Define valid locale types
type ValidLocale = "ka" | "ru" | "en";

// Simple locale mapping function (client-safe)
function getLocaleKey(locale: string): ValidLocale {
    return locale === "ka" ? "ka" : locale === "ru" ? "ru" : "en";
}

const Contact = () => {
    // Use Next.js pathname hook for SSR-compatible path detection
    const pathname = usePathname();

    // Use state to avoid hydration mismatch
    const [localeState, setLocaleState] = useState<{
        raw: string;
        typed: ValidLocale;
    }>({
        raw: "en",
        typed: "en",
    });

    // Set the locale after component mounts to avoid hydration mismatch
    useEffect(() => {
        if (pathname) {
            const segments = pathname.split("/");
            const rawLocale = segments[1] || "en";
            const typedLocale = getLocaleKey(rawLocale);

            setLocaleState({
                raw: rawLocale,
                typed: typedLocale,
            });
        }
    }, [pathname]);

    // Translations
    const translations = {
        address: {
            en: "ADDRESS",
            ka: "მისამართი",
            ru: "АДРЕС"
        },
        contact: {
            en: "CONTACT",
            ka: "კონტაქტი",
            ru: "КОНТАКТ"
        },
        follow: {
            en: "FOLLOW",
            ka: "გამოგვყევით",
            ru: "ПОДПИСАТЬСЯ"
        },
        stayInLoop: {
            en: "Stay in the loop, subscribe",
            ka: "დარჩით კავშირზე, გამოიწერეთ",
            ru: "Оставайтесь в курсе, подпишитесь"
        },
        subscribe: {
            en: "SUBSCRIBE",
            ka: "გამოწერა",
            ru: "ПОДПИСАТЬСЯ"
        },
        emailPlaceholder: {
            en: "EMAIL",
            ka: "ელ.ფოსტა",
            ru: "ЭЛ.ПОЧТА"
        },
        architecture: {
            en: "ARCHITECTURE",
            ka: "არქიტექტურა",
            ru: "АРХИТЕКТУРА"
        },
        laboratory: {
            en: "LABORATORY",
            ka: "ლაბორატორია",
            ru: "ЛАБОРАТОРИЯ"
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Subscription functionality would go here
        console.log("Subscription form submitted");
    };

    return (
        <div className="min-h-screen bg-white mt-[120px] flex justify-center items-center">
            {/* Main content */}
            <div className="container mx-auto px-4 py-24 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {/* ADDRESS Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="mb-4 flex items-center">
                            <div className="w-4 h-4 bg-black mr-2"></div>
                            <h2 className="text-xl font-bold uppercase">
                                {translations.address[localeState.typed]}
                            </h2>
                        </div>
                        <p className="text-gray-800">5 V. RandomStreett.</p>
                        <p className="text-gray-800">Tbilisi, Georgia</p>
                    </div>

                    {/* CONTACT Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="mb-4 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                            <h2 className="text-xl font-bold uppercase">
                                {translations.contact[localeState.typed]}
                            </h2>
                        </div>
                        <p className="text-gray-800">+995 555 555 555</p>
                        <p className="text-gray-800">info@draftwork.com</p>
                    </div>

                    {/* FOLLOW Section */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="mb-4 flex items-center">
                            <div className="w-4 h-4 bg-black transform rotate-45 mr-2"></div>
                            <h2 className="text-xl font-bold uppercase">
                                {translations.follow[localeState.typed]}
                            </h2>
                        </div>
                        <Link href="https://facebook.com" className="text-gray-800 hover:text-gray-600">
                            Facebook
                        </Link>
                        <Link href="https://instagram.com" className="text-gray-800 hover:text-gray-600">
                            Instagram
                        </Link>
                    </div>
                </div>

                {/* Subscription Section */}
                <div className="mt-24 max-w-lg mx-auto">
                    <p className="text-gray-600 mb-4 text-center">
                        {translations.stayInLoop[localeState.typed]}
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <input
                            type="email"
                            placeholder={translations.emailPlaceholder[localeState.typed]}
                            className="border-b border-gray-300 py-2 mb-4 focus:outline-none focus:border-gray-500"
                            required
                        />
                        <button
                            type="submit"
                            className="border border-gray-300 py-2 uppercase hover:bg-gray-100 transition-colors"
                        >
                            {translations.subscribe[localeState.typed]}
                        </button>
                    </form>
                </div>

                {/* Architecture text on right side - vertically */}
                <div className="fixed right-0 top-1/2 transform -translate-y-1/2 -rotate-90 origin-right">
                    <p className="uppercase text-xl font-bold tracking-widest">
                        {translations.architecture[localeState.typed]}
                    </p>
                </div>

                {/* Laboratory text on left side - vertically */}
                <div className="fixed left-[10px] top-1/2 transform -translate-y-1/2 rotate-90 origin-left">
                    <p className="uppercase text-xl font-bold tracking-widest">
                        {translations.laboratory[localeState.typed]}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact; 