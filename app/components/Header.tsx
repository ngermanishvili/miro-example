"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Search, Bell, User } from "lucide-react";
import Logo from "@/public/assets/logo/logo-desktop.svg";

interface HeaderProps {
  className?: string;
  onOpenSearch: () => void; // Callback to open search modal
}

export default function Header({ className, onOpenSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full bg-black from-black/80 to-transparent backdrop-blur-sm">
      <div className="px-4 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Image
                src={Logo}
                alt="Netflix"
                width={120}
                height={35}
                priority
                style={{ height: "auto" }}
              />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-sm text-white hover:text-gray-300 transition"
              >
                Home
              </Link>
              <Link
                href="/tv-shows"
                className="text-sm text-white hover:text-gray-300 transition"
              >
                TV Shows
              </Link>
              <Link
                href="/movies"
                className="text-sm text-white hover:text-gray-300 transition"
              >
                Movies
              </Link>
              <Link
                href="/new-and-popular"
                className="text-sm text-white hover:text-gray-300 transition"
              >
                New & Popular
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            {/* Search button that triggers the modal */}
            <button
              onClick={onOpenSearch}
              className="text-white hover:text-gray-300 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-gray-300 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="text-white hover:text-gray-300 transition"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <Link
              href="/"
              className="block py-2 text-sm text-white hover:text-gray-300 transition"
            >
              Home
            </Link>
            <Link
              href="/tv-shows"
              className="block py-2 text-sm text-white hover:text-gray-300 transition"
            >
              TV Shows
            </Link>
            <Link
              href="/movies"
              className="block py-2 text-sm text-white hover:text-gray-300 transition"
            >
              Movies
            </Link>
            <Link
              href="/new-and-popular"
              className="block py-2 text-sm text-white hover:text-gray-300 transition"
            >
              New & Popular
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
