"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/Header"
import DashboardSidebar from "@/components/dashboard/Sidebar"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

    return (
        <div className="min-h-screen bg-[#1a1b1e] text-white">
            <DashboardHeader
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
            />
            <div className="flex pt-16"> {/* Add padding top for fixed header */}
                <DashboardSidebar
                    isExpanded={isSidebarExpanded}
                    setIsExpanded={setIsSidebarExpanded}
                />
                <main className={`
          flex-1 
          transition-all duration-300
          ${isSidebarExpanded ? "lg:ml-60" : "lg:ml-16"}
          w-full
        `}>
                    {children}
                </main>
            </div>
        </div>
    )
}