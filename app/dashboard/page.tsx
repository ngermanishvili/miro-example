"use client"

import DashboardHero from "@/components/dashboard/DashboardHero"
import FeaturedGames from "@/components/dashboard/FeaturedGames"
import GameCategories from "@/components/dashboard/GameCategories"
import PopularGames from "@/components/dashboard/PopularGames"
import RecommendedGames from "@/components/dashboard/RecommendedGames"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-zinc-950">
            <DashboardHero />

            {/* Main Content with Top Padding for Profile Overlay */}
            <div className="p-6 pt-28">
                <FeaturedGames />
                <GameCategories />
                <div className="mt-8 flex flex-col md:flex-row gap-8">
                    <PopularGames />
                    <RecommendedGames />
                </div>
            </div>
        </div>
    )
}