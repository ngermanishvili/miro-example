"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";

const navLinks = {
  ka: [
    { href: "/", label: "მთავარი" },
    { href: "/projects", label: "პროექტები" },
    { href: "/services", label: "სერვისები" },
    { href: "/partners", label: "პარტნიორები" },
    { href: "/contact", label: "კონტაქტი" },
  ],
  en: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/services", label: "Services" },
    { href: "/partners", label: "Partners" },
    { href: "/contact", label: "Contact" },
  ],
  ru: [
    { href: "/", label: "Главная" },
    { href: "/projects", label: "Проекты" },
    { href: "/services", label: "Услуги" },
    { href: "/partners", label: "Партнеры" },
    { href: "/contact", label: "Контакт" },
  ],
};

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locale, setLocale] = useState("ka");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrolled]);

  // Extract locale from pathname
  useEffect(() => {
    if (!pathname) return;
    const pathParts = pathname.split("/");
    if (pathParts.length > 1 && (pathParts[1] === "ka" || pathParts[1] === "en" || pathParts[1] === "ru")) {
      setLocale(pathParts[1]);
    }
  }, [pathname]);

  // Find active path, handling nested routes
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname?.startsWith(`/${locale}${href}`);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-white/80'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${locale}`} className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks[locale as keyof typeof navLinks].map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={`
                px-4 py-2 rounded-lg
                transition-all duration-200 ease-in-out
                hover:transform hover:scale-110
                ${isActive(link.href)
                  ? "text-black/90 font-medium"
                  : "text-black/60 hover:text-black/90"
                }
              `}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white w-full shadow-lg">
          <div className="container mx-auto py-4">
            {navLinks[locale as keyof typeof navLinks].map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`
                  block py-3 px-4 
                  ${isActive(link.href)
                    ? "text-black/90 font-medium"
                    : "text-black/60"
                  }
                `}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-3 px-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
