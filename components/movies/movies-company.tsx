// components/movies/movies-company.tsx
"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import useSWRInfinite from 'swr/infinite';

interface Movie {
    id: number;
    title_geo: string;
    title_eng: string;
    imdb_vote: number;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string;
    homepage_url: string;
}

interface MoviesApiResponse {
    movies: Movie[];
    page: number;
    limit: number;
    hasMore: boolean;
}

const MOVIES_PER_SECTION = 8;

// სტრიმინგ პლატფორმების კონფიგურაცია
const STREAMING_PLATFORMS = [
    {
        id: "netflix",
        name: "Netflix",
        platform: "netflix",
        logo: "/logos/netflix.svg",
        colorClass: "bg-gradient-to-r from-red-600 to-red-800"
    },
    {
        id: "amazon",
        name: "Amazon Prime",
        platform: "amazon",
        logo: "/logos/amazon-prime.svg",
        colorClass: "bg-gradient-to-r from-blue-500 to-blue-700"
    },
    {
        id: "paramountplus",
        name: "Paramount+",
        platform: "paramountplus",
        logo: "/logos/paramount-plus.svg",
        colorClass: "bg-gradient-to-r from-blue-600 to-blue-900"
    },
    {
        id: "disney",
        name: "Disney+",
        platform: "disney",
        logo: "/logos/disney-plus.svg",
        colorClass: "bg-gradient-to-r from-blue-800 to-indigo-800"
    },
    {
        id: "sonypictures",
        name: "Sony Pictures",
        platform: "sonypictures",
        logo: "/logos/sony-pictures.svg",
        colorClass: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
        id: "universal",
        name: "Universal",
        platform: "universal",
        logo: "/logos/universal.svg",
        colorClass: "bg-gradient-to-r from-gray-700 to-gray-900"
    }
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (platform: string) =>
    (pageIndex: number, previousPageData: MoviesApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return `/api/movies?page=${pageIndex + 1}&limit=${MOVIES_PER_SECTION}&platform=${platform}`;
    };

const MoviesMainPage: React.FC = () => {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    const handlePlatformSelect = (platformId: string) => {
        if (selectedPlatform === platformId) {
            setSelectedPlatform(null); // გამორთვა თუ იგივე პლატფორმაზე დააჭირა
        } else {
            setSelectedPlatform(platformId);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-8">
            {/* სტრიმინგ პლატფორმების ფილტრის სექცია */}
            <div className="container mx-auto px-4 mb-10">
                <h2 className="text-2xl font-bold mb-6">სტრიმინგ პლატფორმები</h2>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {STREAMING_PLATFORMS.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => handlePlatformSelect(platform.id)}
                            className={`
                relative overflow-hidden rounded-lg shadow-md transition-all duration-300 
                ${selectedPlatform === platform.id
                                    ? 'ring-2 ring-red-500 scale-105 z-10'
                                    : 'hover:scale-102 hover:bg-gray-800'
                                }
                flex flex-col items-center justify-center p-3 bg-gray-800
              `}
                        >
                            <div className="relative w-12 h-12 mb-2">
                                <Image
                                    src={platform.logo}
                                    alt={platform.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-sm font-medium text-center">{platform.name}</span>

                            {selectedPlatform === platform.id && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* არჩეული პლატფორმის ფილმების სექცია */}
            {selectedPlatform ? (
                <StreamingSection key={selectedPlatform} platform={selectedPlatform} />
            ) : (
                // თუ არცერთი პლატფორმა არ არის არჩეული, ყველა პლატფორმის სექცია ჩანს
                <div className="container mx-auto px-4">
                    {STREAMING_PLATFORMS.map((platform) => (
                        <StreamingSection key={platform.id} platform={platform.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ცალკეული სტრიმინგ პლატფორმის სექცია
function StreamingSection({ platform }: { platform: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data, error, size, setSize } = useSWRInfinite<MoviesApiResponse>(
        (pageIndex, previousPageData) => getKey(platform)(pageIndex, previousPageData),
        fetcher,
        { revalidateFirstPage: false, revalidateOnFocus: false }
    );

    // ჰორიზონტალური სქროლი
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const movies = data?.flatMap(page => page.movies) || [];
    const isLoading = !data && !error;
    const hasMore = data?.[data.length - 1]?.hasMore || false;
    const platformInfo = STREAMING_PLATFORMS.find(p => p.id === platform)!;

    // მეტი კონტენტის ჩატვირთვა
    const loadMore = () => {
        if (hasMore && !isLoading) {
            setSize(size + 1);
        }
    };

    // თუ მონაცემები ცარიელია და არ ტვირთავს, არ აჩვენო სექცია
    if (!isLoading && (!movies || movies.length === 0)) {
        return null;
    }

    return (
        <section className="mb-12 group/row">
            <div className="container mx-auto px-4">
                <div className="flex items-center mb-4">
                    <div className={`w-1 h-12 ${platformInfo.colorClass} mr-3`}></div>
                    <div>
                        <h2 className="text-2xl font-bold">{platformInfo.name}</h2>
                        <p className="text-gray-400 text-sm">პოპულარული ფილმები</p>
                    </div>
                </div>

                <div className="relative px-2 hover:z-10">
                    <div
                        ref={scrollRef}
                        className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide snap-x"
                    >
                        {isLoading ? (
                            // ჩატვირთვის ანიმაცია
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="flex-none w-[250px] snap-start">
                                    <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                    <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
                                </div>
                            ))
                        ) : movies.length > 0 ? (
                            // ფილმების ქარდები
                            movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 w-full">
                                {platformInfo.name}-ის ფილმები ვერ მოიძებნა
                            </div>
                        )}

                        {/* ჩატვირთეთ მეტი ღილაკი */}
                        {hasMore && (
                            <div className="flex-none w-[250px] snap-start">
                                <button
                                    onClick={loadMore}
                                    className="h-[140px] w-[250px] border-2 border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                >
                                    მეტის ჩვენება
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ნავიგაციის ღილაკები */}
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

                    {/* გრადიენტები მხარეებზე */}
                    <div className="absolute top-0 bottom-8 left-2 bg-gradient-to-r from-black via-black/50 to-transparent w-12" />
                    <div className="absolute top-0 bottom-8 right-2 bg-gradient-to-l from-black via-black/50 to-transparent w-12" />
                </div>
            </div>
        </section>
    );
}

export default MoviesMainPage;