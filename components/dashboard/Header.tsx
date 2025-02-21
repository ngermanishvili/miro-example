"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Plus, Search, MessageCircle } from "lucide-react"
import LogoDesktop from '@/public/assets/logo/logo-desktop.svg'
import Image from "next/image"

interface HeaderProps {
    isSidebarExpanded: boolean
    setIsSidebarExpanded: (value: boolean) => void
}

export default function DashboardHeader({ isSidebarExpanded, setIsSidebarExpanded }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center gap-2 p-4 border-b border-gray-800 bg-[#1a1b1e]">
            {/* Logo & Toggle Section */}
            <div className="flex items-center gap-2 lg:w-auto w-full">
                <button
                    onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                    className="p-1 hover:bg-gray-800 rounded-lg lg:hidden"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full" />
                <Image width={120} height={120} src={LogoDesktop} alt="Logo" />
            </div>

            {/* Search Section */}
            <div className="relative flex-1 max-w-xl order-3 lg:order-2 w-full lg:w-auto mt-2 lg:mt-0">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-8 bg-gray-900 border-gray-800 w-full"
                    />
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 order-2 lg:order-3 ml-auto">
                <Button className="bg-blue-600 hover:bg-blue-700 px-2 lg:px-4 text-sm">
                    <Plus className="w-4 h-4" />
                    <span className="hidden lg:inline ml-2">Add video</span>
                </Button>

                <div className="hidden lg:flex items-center gap-2">
                    <Button variant="ghost" className="text-sm">Cases</Button>
                    <Button variant="ghost" className="text-sm">Dashboard</Button>
                    <Button variant="ghost" className="text-sm">FAQ</Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">1</div>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">784</span>
                        <div className="w-8 h-8 rounded-full bg-gray-700" />
                    </div>
                </div>
            </div>
        </header>
    )
}