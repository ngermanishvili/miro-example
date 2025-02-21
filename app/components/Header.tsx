// Header.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Search, Bell, User } from "lucide-react"
import Logo from "@/public/assets/logo/logo-desktop.svg"

interface StreamingServicesProps {
  className?: string;
}

export default function Header({ className }: StreamingServicesProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-black from-black/80 to-transparent backdrop-blur-sm">
      <div className="px-4 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Image src={Logo} alt="Netflix" width={120} height={25} priority />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-sm text-white hover:text-gray-300 transition">
                Home
              </Link>
              <Link href="/tv-shows" className="text-sm text-white hover:text-gray-300 transition">
                TV Shows
              </Link>
              <Link href="/movies" className="text-sm text-white hover:text-gray-300 transition">
                Movies
              </Link>
              <Link href="/new-and-popular" className="text-sm text-white hover:text-gray-300 transition">
                New & Popular
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-gray-300 transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-gray-300 transition">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-gray-300 transition">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <Link href="/" className="block py-2 text-sm text-white hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="/tv-shows" className="block py-2 text-sm text-white hover:text-gray-300 transition">
              TV Shows
            </Link>
            <Link href="/movies" className="block py-2 text-sm text-white hover:text-gray-300 transition">
              Movies
            </Link>
            <Link href="/new-and-popular" className="block py-2 text-sm text-white hover:text-gray-300 transition">
              New & Popular
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}