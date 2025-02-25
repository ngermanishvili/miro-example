"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TVShowCard from "../TVShowCard";

interface Genre {
    id: number;
    name: string;
}

interface TVShow {
    id: number;
    title_geo: string;
    title_eng: string;
    imdb_vote: number | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | null;
    homepage_url: string | null;
    poster_logo?: { logo_path: string } | null;
}

interface SimilarTVShowsProps {
    showId: number;
    genres?: Genre[];
}

export default function SimilarTVShows({ showId, genres = [] }: SimilarTVShowsProps) {
    const [similarShows, setSimilarShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // მსგავსი სერიალების ჩატვირთვა
    useEffect(() => {
        const fetchSimilarShows = async () => {
            try {
                setLoading(true);

                // API call to fetch similar TV shows based on genre and excluding current show
                const genreIds = genres?.map(g => g.id).join(",") || "";
                const response = await fetch(`/api/tv-series?limit=12&genres=${genreIds}&exclude=${showId}`);

                if (!response.ok) {
                    throw new Error("მსგავსი სერიალების ჩატვირთვა ვერ მოხერხდა");
                }

                const data = await response.json();
                setSimilarShows(data.series || []);
                setError(null);
            } catch (error) {
                console.error("Error fetching similar shows:", error);
                setError("მსგავსი სერიალების ჩატვირთვა ვერ მოხერხდა");
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarShows();
    }, [showId, genres]);

    // ჰორიზონტალური სქროლის ფუნქცია
    const handleScroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;

        const scrollAmount = direction === "left" ? -500 : 500;
        scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    // ჩატვირთვის მდგომარეობა
    if (loading) {
        return (
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-none w-[250px]">
                        <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                        <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    // შეცდომა
    if (error || similarShows.length === 0) {
        return (
            <div className="p-6 bg-gray-900 rounded-md text-center">
                <p className="text-gray-400">
                    {error || "მსგავსი სერიალები ვერ მოიძებნა"}
                </p>
            </div>
        );
    }

    return (
        <div className="relative group/row">
            <div className="px-2">
                <div
                    ref={scrollContainerRef}
                    className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                >
                    {similarShows.map((show) => (
                        <TVShowCard key={show.id} show={show} />
                    ))}
                </div>

                {/* ნავიგაციის ღილაკები */}
                <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* გრადიენტები მხარეებზე */}
                <div className="absolute top-0 bottom-6 left-2 bg-gradient-to-r from-black via-black/50 to-transparent w-12 pointer-events-none" />
                <div className="absolute top-0 bottom-6 right-2 bg-gradient-to-l from-black via-black/50 to-transparent w-12 pointer-events-none" />
            </div>
        </div>
    );
}