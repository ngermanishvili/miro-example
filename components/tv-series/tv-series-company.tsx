"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Play, Plus } from 'lucide-react';
import useSWRInfinite from 'swr/infinite';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';


interface TVShow {
    id: number;
    title_eng: string;
    title_geo: string;
    imdb_vote: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | null;
    poster_logo: { logo_path: string } | null;
    homepage_url?: string;
}

interface TVShowsApiResponse {
    series: TVShow[];
    page: number;
    limit: number;
    hasMore: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';
const SHOWS_PER_SECTION = 8;

const COLOR_GRADIENTS = [
    "bg-gradient-to-r from-pink-500 to-purple-600",
    "bg-gradient-to-r from-cyan-400 to-blue-600",
    "bg-gradient-to-r from-orange-400 to-red-600",
    "bg-gradient-to-r from-green-400 to-emerald-600",
    "bg-gradient-to-r from-yellow-400 to-amber-600",
    "bg-gradient-to-r from-indigo-500 to-violet-600",
    "bg-gradient-to-r from-rose-500 to-pink-600"
];

// Update your streaming services configuration
const STREAMING_SERVICES = [
    {
        id: "149",
        name: "Netflix",
        platform: "netflix",
        logo: "/assets/production-companies/netflix.png",
        colorClass: "bg-gradient-to-r from-netflix-red to-netflix-darkred"
    },
    {
        id: "2",
        name: "Disney",
        platform: "disneyplus",
        logo: "/assets/production-companies/disney.png",
        colorClass: "bg-gradient-to-r from-disney-blue to-disney-darkblue"
    },
    {
        id: "1342",
        name: "HBO",
        platform: "hbo",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-hbo-teal to-hbo-darkteal"
    },
    {
        id: "688",
        name: "Paramount",
        platform: "paramountplus",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-paramount-blue to-paramount-darkblue"
    },
    {
        id: "883",
        name: "Amazon",
        platform: "amazon",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-amazon-teal to-amazon-darkteal"
    }
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (companyId: string, platform: string) =>
    (pageIndex: number, previousPageData: TVShowsApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return `/api/tv-series?page=${pageIndex + 1}&limit=${SHOWS_PER_SECTION}&companies=${companyId}&platform=${platform}`;
    };

export default function TVShowsMainPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <main className="container mx-auto px-4 md:px-2 lg:px-2 py-8">
                {STREAMING_SERVICES.map((service) => (
                    <StreamingSection
                        key={service.id}
                        companyId={service.id}
                        platform={service.platform}
                        serviceName={service.name}
                    />
                ))}
            </main>
        </div>
    );
}

function StreamingSection({ companyId, platform, serviceName }:
    { companyId: string; platform: string; serviceName: string }) {

    const scrollRef = useRef<HTMLDivElement>(null);
    const { data, error, size, setSize, isValidating } = useSWRInfinite<TVShowsApiResponse>(
        (pageIndex, previousPageData) => getKey(companyId, platform)(pageIndex, previousPageData),
        fetcher,
        { revalidateFirstPage: false, revalidateOnFocus: false }
    );

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };


    const shows = data?.flatMap(page => page.series) || [];
    const isLoading = !data && !error;
    const hasMore = data?.[data.length - 1]?.hasMore || false;
    const service = STREAMING_SERVICES.find(s => s.id === companyId)!;

    return (
        <section className="mb-12 group/row">

            <div className='flex '>
                <div className="relative w-8 h-8 bg-white rounded-md mb-2">
                    <Image
                        src={service.logo}
                        alt={service.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                    />
                </div>
                <h2 className="text-2xl font-semibold mb-4 px-8" >{serviceName}</h2>

            </div>

            <div className="relative px-8 hover:z-10">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide snap-x"
                >
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex-none w-[250px] snap-start">
                                <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                <div className="h-4 bg-zinc-900 rounded mt-2 w-3/4 animate-pulse" />
                            </div>
                        ))
                    ) : shows.length > 0 ? (
                        shows.map((show) => (
                            <TVShowCard key={show.id} show={show} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 w-full">
                            No {serviceName} shows found
                        </div>
                    )}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Gradient overlays */}
                <div className="absolute top-0 bottom-8 left-8 bg-gradient-to-r from-black via-black/50 to-transparent w-12" />
                <div className="absolute top-0 bottom-8 right-8 bg-gradient-to-l from-black via-black/50 to-transparent w-12" />
            </div>
        </section>
    );
} function TVShowCard({ show }: { show: TVShow }) {
    const [imgSrc, setImgSrc] = useState(() => {
        if (show.backdrop_poster_url) {
            try {
                const url = new URL(show.backdrop_poster_url);
                if (url.hostname && url.protocol.startsWith('http')) {
                    return show.backdrop_poster_url;
                }
            } catch {
                return FALLBACK_IMAGE;
            }
        }
        if (show.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w500${show.backdrop_path_tmdb}`;
        }
        return FALLBACK_IMAGE;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex-none w-[250px] transition-transform duration-300 group cursor-pointer"
        >
            <div className="relative h-[140px] w-[250px] rounded-md overflow-hidden shadow-lg">
                <div className="relative h-full w-full">
                    <Image
                        src={imgSrc}
                        alt={show.title_eng || `${show.title_geo} cover`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover rounded-md"
                        loading="lazy"
                        onError={() => setImgSrc(FALLBACK_IMAGE)}
                        unoptimized={!imgSrc.startsWith('https://image.tmdb.org')}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Poster Logo in the middle */}
                    {show.poster_logo?.logo_path && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-12">
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${show.poster_logo.logo_path}`}
                                alt="Logo"
                                fill
                                className="object-contain object-center"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* IMDB Rating */}
                    {show.imdb_vote && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white">
                                {parseFloat(show.imdb_vote).toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                            className="bg-white text-black p-2 rounded-full mr-2 hover:bg-opacity-80 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Play className="w-6 h-6" />
                        </button>
                        <button
                            className="bg-gray-800 text-white p-2 rounded-full hover:bg-opacity-80 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Title and Info */}
            <div className="mt-2 px-1">
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 line-clamp-1">
                    {show.title_geo || show.title_eng}
                </p>
                {show.title_geo && show.title_eng && (
                    <p className="text-xs text-gray-400 line-clamp-1">
                        {show.title_geo !== show.title_eng ? show.title_eng : ''}
                    </p>
                )}
                {show.release_date && (
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(show.release_date).getFullYear()}
                    </p>
                )}
            </div>
        </motion.div>
    );
}