"use client"
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    menuLinks: { label: string; href: string }[];
}

const Header = ({ menuLinks }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fixed top-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-4">
                {/* Desktop and Mobile Navigation Container */}
                <div className="flex justify-between items-center">
                    {/* Logo */}
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

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8 font-bold text-gray-800">
                            {menuLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-800" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-800" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`
                        fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out
                        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                        md:hidden
                    `}
                >
                    <div className="pt-20 px-6">
                        <nav>
                            <ul className="space-y-6">
                                {menuLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-xl font-bold text-gray-800 block hover:text-gray-600 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;