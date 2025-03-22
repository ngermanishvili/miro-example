"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

const languages: Language[] = [
    { code: "ka", name: "Georgian", nativeName: "ქართული" },
    { code: "en", name: "English", nativeName: "English" },
    { code: "ru", name: "Russian", nativeName: "Русский" }
];

export const LanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = (params?.locale as string) || "ka";
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    // Find current language object
    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    // Construct the path for a new locale
    const getLocalizedPath = (locale: string) => {
        // Get path segments and replace the locale part
        const pathParts = pathname.split('/');

        // First part after the slash should be the locale
        if (pathParts.length > 1) {
            pathParts[1] = locale;
        }

        return pathParts.join('/');
    };

    const changeLanguage = (locale: string) => {
        const newPath = getLocalizedPath(locale);
        router.push(newPath);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                onClick={toggleDropdown}
                style={{ fontFamily: currentLocale === "ka" ? '"Bebas Neue", sans-serif' : '"Montserrat", sans-serif' }}
            >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage.nativeName}</span>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                    <div className="py-1" role="menu">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                className={`block w-full text-left px-4 py-2 text-sm ${currentLocale === language.code
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                role="menuitem"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeLanguage(language.code);
                                }}
                                style={{ fontFamily: language.code === "ka" ? '"Bebas Neue", sans-serif' : '"Montserrat", sans-serif' }}
                            >
                                <span className="flex items-center">
                                    {language.nativeName}
                                    <span className="ml-2 text-xs text-gray-500">
                                        {language.code !== language.name.toLowerCase() && `(${language.name})`}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;