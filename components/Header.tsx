'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type MenuItem = {
    label: string;
    path: string;
    isRoute?: boolean;
};

const menuItems: MenuItem[] = [
    { label: 'Projects', path: '/projects', isRoute: true },
    { label: 'About', path: 'about' },
    { label: 'Services', path: '/services', isRoute: true },
    { label: 'Partners', path: '/partners', isRoute: true },
    { label: 'Contact', path: 'contact' },
    { label: 'Geo', path: 'geo' },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const renderMenuItem = (item: MenuItem) => {
        if (item.isRoute) {
            return (
                <Link
                    href={item.path}
                    className="hover:text-gray-600 transition-colors duration-200"
                >
                    {item.label}
                </Link>
            );
        }
        return (
            <button
                onClick={() => console.log(item.path)}
                className="hover:text-gray-600 transition-colors duration-200"
            >
                {item.label}
            </button>
        );
    };

    return (
        <header className="fixed top-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="relative z-50">
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
                        <ul className="flex space-x-8 font-bold text-gray-800">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    {renderMenuItem(item)}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-800" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-800" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40">
                        <nav className="px-6 py-8">
                            <ul className="space-y-6">
                                {menuItems.map((item) => (
                                    <li key={item.path}>
                                        {item.isRoute ? (
                                            <Link
                                                href={item.path}
                                                className="text-xl font-bold text-gray-800 block hover:text-gray-600 transition-colors duration-200"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    console.log(item.path);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="text-xl font-bold text-gray-800 block hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {item.label}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;