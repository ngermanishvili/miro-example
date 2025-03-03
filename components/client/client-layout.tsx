'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Hero from '@/app/components/Hero'
import StreamingServices from '@/app/components/StreamingServices'
import ContentTypeSwitcher from '@/app/components/ContentTypeSwitcher'
import type { ContentType } from "@/types/tv"
import DashboardSidebar from '@/components/dashboard/Sidebar'

interface GlobalLayoutProps {
    children: React.ReactNode
    className?: string;
}

export default function GlobalLayout({ children, className }: GlobalLayoutProps) {
    const [contentType, setContentType] = useState<ContentType>('movies')
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

    return (
        <div className={`relative min-h-screen bg-black text-white ${className || ''}`}>
            {/* Fixed Header */}
            {/* <Header className="fixed top-0 left-0 right-0 z-50" /> */}

            <div className="flex min-h-screen pt-16">
                {/* Sidebar */}
                <DashboardSidebar
                    isExpanded={isSidebarExpanded}
                    setIsExpanded={setIsSidebarExpanded}
                />

                {/* Main Content */}
                <main
                    className={`
                        flex-1
                        transition-all
                        duration-300
                        ${isSidebarExpanded ? "lg:ml-60" : "lg:ml-16"}
                    `}
                >
                    {/* Hero Section */}
                    {/* <Hero
                        title_eng="Example Title"
                        title_geo="მაგალითი სათაური"
                        description_eng="Example description"
                        description_geo="მაგალითი აღწერა"
                        imagePath="/placeholder.svg"
                    /> */}

                    {/* Content Area */}
                    <div className="px-2 sm:px-4 pb-8">
                        <StreamingServices className="mt-8" />
                        <ContentTypeSwitcher
                            initialType={contentType}
                            onTypeChange={setContentType}
                        />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}