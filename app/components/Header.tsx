"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Search, Bell, User } from "lucide-react"

interface StreamingServicesProps {
  className?: string;
}

export default function Header({ className }: StreamingServicesProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/netflix-logo.svg" alt="Netflix" width={92} height={25} />
            </Link>
            <nav className="hidden md:flex ml-8 space-x-4">
              <Link href="/" className="text-sm text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/tv-shows" className="text-sm text-gray-300 hover:text-white">
                TV Shows
              </Link>
              <Link href="/movies" className="text-sm text-gray-300 hover:text-white">
                Movies
              </Link>
              <Link href="/new-and-popular" className="text-sm text-gray-300 hover:text-white">
                New & Popular
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-white">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <Link href="/" className="block py-2 text-sm text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/tv-shows" className="block py-2 text-sm text-gray-300 hover:text-white">
              TV Shows
            </Link>
            <Link href="/movies" className="block py-2 text-sm text-gray-300 hover:text-white">
              Movies
            </Link>
            <Link href="/new-and-popular" className="block py-2 text-sm text-gray-300 hover:text-white">
              New & Popular
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

