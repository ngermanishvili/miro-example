// components/movies/movies-company.tsx
"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
    poster_logo?: { logo_path: string } | null;
}

interface MoviesApiResponse {
    movies: Movie[];
    page: number;
    limit: number;
    hasMore: boolean;
}

const MOVIES_PER_ROW = 8;
const INITIAL_ROWS = 2; // 2 მწკრივი ფილტრაციისას

// სტრიმინგ პლატფორმების კონფიგურაცია
const STREAMING_PLATFORMS = [
    {
        id: "netflix",
        name: "Netflix",
        platform: "netflix",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-red-600 to-red-800"
    },
    {
        id: "amazon",
        name: "Amazon Prime",
        platform: "amazon",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-blue-500 to-blue-700"
    },
    {
        id: "paramountplus",
        name: "Paramount+",
        platform: "paramountplus",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-blue-600 to-blue-900"
    },
    {
        id: "disney",
        name: "Disney+",
        platform: "disney",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-blue-800 to-indigo-800"
    },
    {
        id: "sonypictures",
        name: "Sony Pictures",
        platform: "sonypictures",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-blue-600 to-blue-800"
    },
    {
        id: "universal",
        name: "Universal",
        platform: "universal",
        logo: "/assets/production-companoes/netflix.png",
        colorClass: "bg-gradient-to-r from-gray-700 to-gray-900"
    }
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (platform: string, isFiltered: boolean) =>
    (pageIndex: number, previousPageData: MoviesApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        // ფილტრაციისას უფრო მეტი ფილმის ჩატვირთვა
        const limit = isFiltered ? MOVIES_PER_ROW * INITIAL_ROWS : MOVIES_PER_ROW;
        return `/api/movies?page=${pageIndex + 1}&limit=${limit}&platform=${platform}`;
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
                <StreamingSection key={selectedPlatform} platform={selectedPlatform} isFiltered={true} />
            ) : (
                // თუ არცერთი პლატფორმა არ არის არჩეული, ყველა პლატფორმის სექცია ჩანს
                <div className="container mx-auto px-4">
                    {STREAMING_PLATFORMS.map((platform) => (
                        <StreamingSection key={platform.id} platform={platform.id} isFiltered={false} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ცალკეული სტრიმინგ პლატფორმის სექცია
function StreamingSection({ platform, isFiltered }: { platform: string, isFiltered: boolean }) {
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [visibleRows, setVisibleRows] = useState(isFiltered ? INITIAL_ROWS : 1);

    const { data, error, size, setSize } = useSWRInfinite<MoviesApiResponse>(
        (pageIndex, previousPageData) => getKey(platform, isFiltered)(pageIndex, previousPageData),
        fetcher,
        { revalidateFirstPage: false, revalidateOnFocus: false }
    );

    // ჰორიზონტალური სქროლი კონკრეტული მწკრივისთვის
    const scroll = (direction: 'left' | 'right', rowIndex: number) => {
        if (rowRefs.current[rowIndex]) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            rowRefs.current[rowIndex].scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const allMovies = data?.flatMap(page => page.movies) || [];
    const isLoading = !data && !error;
    const hasMore = data?.[data.length - 1]?.hasMore || false;
    const platformInfo = STREAMING_PLATFORMS.find(p => p.id === platform)!;

    // ფილმების მწკრივებად დაყოფა
    const movieRows: Movie[][] = [];
    for (let i = 0; i < visibleRows; i++) {
        const startIndex = i * MOVIES_PER_ROW;
        const endIndex = startIndex + MOVIES_PER_ROW;
        const rowMovies = allMovies.slice(startIndex, endIndex);

        if (rowMovies.length > 0 || isLoading) {
            movieRows.push(rowMovies);
        }
    }

    // მეტი კონტენტის ჩატვირთვა
    const loadMore = () => {
        if (hasMore && !isLoading) {
            setSize(size + 1);
            setVisibleRows(visibleRows + 1);
        }
    };

    // თუ მონაცემები ცარიელია და არ ტვირთავს, არ აჩვენო სექცია
    if (!isLoading && (!allMovies || allMovies.length === 0)) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center mb-4">
                    <div className={`w-1 h-12 ${platformInfo.colorClass} mr-3`}></div>
                    <div>
                        <h2 className="text-2xl font-bold">{platformInfo.name}</h2>
                        <p className="text-gray-400 text-sm">პოპულარული ფილმები</p>
                    </div>
                </div>

                {/* ფილმების მწკრივები */}
                {movieRows.map((rowMovies, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="relative px-2 mb-8 group/row">
                        <div
                            ref={el => { rowRefs.current[rowIndex] = el; }}
                            className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                        >
                            {rowMovies.length > 0 ? (
                                // ფილმების ქარდები
                                rowMovies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))
                            ) : isLoading ? (
                                // ჩატვირთვის ანიმაცია
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="flex-none w-[250px] snap-start">
                                        <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                        <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 w-full">
                                    {platformInfo.name}-ის ფილმები ვერ მოიძებნა
                                </div>
                            )}

                            {/* მეტის ჩვენების ღილაკი ბოლო მწკრივში */}
                            {rowIndex === movieRows.length - 1 && hasMore && (
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
                        {rowMovies.length > 0 && (
                            <>
                                <button
                                    onClick={() => scroll('left', rowIndex)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={() => scroll('right', rowIndex)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>

                                {/* გრადიენტები მხარეებზე */}
                                <div className="absolute top-0 bottom-6 left-2 bg-gradient-to-r from-black via-black/50 to-transparent w-12" />
                                <div className="absolute top-0 bottom-6 right-2 bg-gradient-to-l from-black via-black/50 to-transparent w-12" />
                            </>
                        )}
                    </div>
                ))}

                {/* მეტის ჩვენების ღილაკი მთელი სექციისთვის (ოფციონალური) */}
                {isFiltered && hasMore && movieRows.length >= INITIAL_ROWS && (
                    <div className="flex justify-center mt-4 mb-8">
                        <button
                            onClick={loadMore}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition-colors"
                        >
                            <span>მეტი ფილმის ნახვა</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MoviesMainPage;