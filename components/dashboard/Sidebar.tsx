"use client"

import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Home,
    TrendingUp,
    PlayCircle,
    Tv,
    Film,
    Heart
} from "lucide-react"

interface SidebarProps {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    className?: string;
}

export default function DashboardSidebar({ isExpanded, setIsExpanded, className }: SidebarProps) {
    const navigationItems = [
        { icon: <Home className="w-5 h-5" />, label: "მთავარი", href: "/" },
        { icon: <TrendingUp className="w-5 h-5" />, label: "პოპულარული", href: "/trending" },
        { icon: <PlayCircle className="w-5 h-5" />, label: "ახალი დამატებული", href: "/latest" },
        { icon: <Film className="w-5 h-5" />, label: "ფილმები", href: "/movies" },
        { icon: <Tv className="w-5 h-5" />, label: "სერიალები", href: "/tvshows" },
        { icon: <Heart className="w-5 h-5" />, label: "ფავორიტები", href: "/favorites", badge: "12" },
    ]

    return (
        <aside
            className={`
                fixed left3 top-16 bottom-0 
                ${isExpanded ? "w-60" : "w-16"}
                transition-all duration-300
                bg-[#1a1b1e] border-r border-gray-800
                transform
                ${isExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                z-40
                ${className || ''}
            `}
        >
            <nav className="h-full overflow-y-auto p-4 relative">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-4 bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 shadow-lg hidden lg:block"
                >
                    {isExpanded ? (
                        <ChevronLeft className="w-4 h-4 text-white" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-white" />
                    )}
                </button>

                <div className="space-y-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center gap-3 p-2
                                text-gray-400 hover:text-white rounded-lg hover:bg-gray-800
                                ${isExpanded ? "justify-start" : "justify-center"}
                                text-sm
                            `}
                        >
                            {item.icon}
                            <span className={`${isExpanded ? "block" : "hidden"} whitespace-nowrap`}>
                                {item.label}
                            </span>
                            {item.badge && (
                                <span className={`
                                    ml-auto bg-red-500 text-white text-xs px-1.5 rounded-full
                                    ${!isExpanded && "hidden"}
                                `}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </aside>
    )
}