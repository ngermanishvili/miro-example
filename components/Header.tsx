'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Link, usePathname } from '../src/i18n/routing';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

type MenuItem = {
    id: number;
    path: string;
    translations: {
        ka: string;
        en: string;
        ru: string;
    };
    isRoute?: boolean;
};

const menuItems: MenuItem[] = [
    {
        id: 1,
        path: '/projects',
        translations: {
            en: 'Projects',
            ka: 'პროექტები',
            ru: 'Проекты'
        },
        isRoute: true
    },
    {
        id: 2,
        path: '/about',
        translations: {
            en: 'About',
            ka: 'ჩვენს შესახებ',
            ru: 'О нас'
        },
        isRoute: true
    },
    {
        id: 3,
        path: '/services',
        translations: {
            en: 'Services',
            ka: 'სერვისები',
            ru: 'Услуги'
        },
        isRoute: true
    },
    {
        id: 4,
        path: '/partners',
        translations: {
            en: 'Partners',
            ka: 'პარტნიორები',
            ru: 'Партнеры'
        },
        isRoute: true
    },
    {
        id: 5,
        path: '/contact',
        translations: {
            en: 'Contact',
            ka: 'კონტაქტი',
            ru: 'Контакты'
        },
        isRoute: true
    },
];

const languages = [
    { code: 'ka', nativeName: 'ქართული' },
    { code: 'en', nativeName: 'English' },
    { code: 'ru', nativeName: 'Русский' },
];

type LocaleKey = 'ka' | 'en' | 'ru';

const languageNames: Record<LocaleKey, string> = {
    ka: 'KA',
    en: 'EN',
    ru: 'RU',
};

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const locale = useLocale() as LocaleKey;
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get full path with locale
    const getFullPath = (routePath: string) => {
        return `/${locale}${routePath}`;
    };

    // Check if current path is active
    const isActivePath = (routePath: string) => {
        // The pathname doesn't include the locale, so we just compare with the route path
        return pathname === routePath;
    };

    // Switch language
    const switchLanguage = (langCode: string) => {
        // Use regex to ensure we're replacing only the locale part at the beginning of the path
        const newPath = pathname.replace(/^\/[a-z]{2}/, `/${langCode}`);

        // Handle the root path case
        if (pathname === `/${locale}` || pathname === '/') {
            router.push(`/${langCode}`);
        } else {
            router.push(newPath);
        }

        setLangDropdownOpen(false);
    };

    return (
        <header className="fixed top-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href={`/${locale}`} className="relative z-50">
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            width={150}
                            height={50}
                            priority
                            className="w-32 md:w-36 lg:w-40"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8 font-bold">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    {item.isRoute ? (
                                        <Link
                                            href={getFullPath(item.path)}
                                            className={`hover:text-gray-600 hover:scale-110 transition-all duration-200 ${isActivePath(item.path) ? 'text-black font-extrabold' : 'text-gray-500'}`}
                                        >
                                            {item.translations[locale as keyof typeof item.translations]}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => console.log(item.path)}
                                            className="text-gray-500 hover:text-gray-600 hover:scale-110 transition-all duration-200"
                                        >
                                            {item.translations[locale as keyof typeof item.translations]}
                                        </button>
                                    )}
                                </li>
                            ))}

                            {/* Language Dropdown */}
                            <li>
                                <div ref={dropdownRef} className="relative">
                                    <button
                                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                        className="flex items-center text-gray-800 hover:text-gray-600 active:text-black transition-colors duration-200"
                                    >
                                        <Globe className="w-4 h-4 mr-1" />
                                        <span>{languageNames[locale]}</span>
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </button>

                                    {langDropdownOpen && (
                                        <div className="absolute right-0 mt-2 py-2 w-40 bg-white rounded shadow-lg z-50">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    className={`block w-full text-left px-4 py-2 text-sm hover:scale-105 transition-all duration-200 ${locale === lang.code
                                                        ? 'text-blue-600 font-bold'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                    onClick={() => switchLanguage(lang.code)}
                                                >
                                                    {lang.nativeName}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-gray-800 active:text-black"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40">
                        <nav className="px-6 py-8">
                            <ul className="space-y-6">
                                {menuItems.map((item) => (
                                    <li key={item.id}>
                                        {item.isRoute ? (
                                            <Link
                                                href={getFullPath(item.path)}
                                                className={`text-xl font-bold block hover:text-gray-600 hover:scale-105 transition-all duration-200 ${isActivePath(item.path) ? 'text-black' : 'text-gray-500'
                                                    }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.translations[locale]}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    console.log(item.path);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="text-xl font-bold text-gray-500 block hover:text-gray-600 hover:scale-105 transition-all duration-200"
                                            >
                                                {item.translations[locale]}
                                            </button>
                                        )}
                                    </li>
                                ))}
                                {/* Language Options in Mobile Menu */}
                                <li className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-2">
                                        {locale === 'en' ? 'Language' :
                                            locale === 'ka' ? 'ენა' : 'Язык'}
                                    </p>
                                    <div className="flex flex-col space-y-3">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`text-lg font-bold block text-left hover:scale-105 transition-all duration-200 ${locale === lang.code
                                                    ? 'text-blue-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                onClick={() => {
                                                    switchLanguage(lang.code);
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                {lang.nativeName}
                                            </button>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;