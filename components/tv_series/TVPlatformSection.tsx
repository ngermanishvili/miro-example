// components/tv-series/TVPlatformSection.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import TVShowCard from './TVShowCard';
import useSWRInfinite from 'swr/infinite';

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

interface TVShowsApiResponse {
    series: TVShow[];
    page: number;
    limit: number;
    hasMore: boolean;
}

interface TVPlatformSectionProps {
    platformId: string;
    platformName: string;
    colorClass?: string;
}

const SHOWS_PER_ROW = 8;
const INITIAL_ROWS = 2; // Now showing 2 rows when filtered

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TVPlatformSection: React.FC<TVPlatformSectionProps> = ({
    platformId,
    platformName,
    colorClass = "bg-gradient-to-r from-purple-600 to-indigo-800"
}) => {
    const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

    // API ენდფოინთის გამოძახება
    const getKey = (pageIndex: number, previousPageData: TVShowsApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        // ლიმიტი რამდენჯერ მეტი იქნება ვიდრე SHOWS_PER_ROW * INITIAL_ROWS
        const limit = SHOWS_PER_ROW * INITIAL_ROWS;
        return `/api/tv-series?page=${pageIndex + 1}&limit=${limit}&platform=${platformId}`;
    };

    const { data, error, size, setSize } = useSWRInfinite<TVShowsApiResponse>(getKey, fetcher, {
        revalidateFirstPage: false,
        revalidateOnFocus: false
    });

    const isLoading = !data && !error;
    const allShows = data?.flatMap(page => page.series) || [];
    const hasMore = data?.[data.length - 1]?.hasMore || false;

    // მწკრივებად დაყოფა
    const rows: TVShow[][] = [];
    for (let i = 0; i < visibleRows; i++) {
        const startIndex = i * SHOWS_PER_ROW;
        const endIndex = startIndex + SHOWS_PER_ROW;
        const rowShows = allShows.slice(startIndex, endIndex);
        rows.push(rowShows);
    }

    // მეტი მონაცემების ჩატვირთვა
    const loadMore = () => {
        if (hasMore) {
            setSize(size + 1);
            setVisibleRows(visibleRows + 1);
        }
    };

    // სკროლის ფუნქცია
    const scroll = (direction: 'left' | 'right', rowIndex: number) => {
        const row = rowRefs.current[rowIndex];
        if (row) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            row.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // თუ დატა არ არის, არაფერი გამოვაჩინოთ
    if (!isLoading && allShows.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="container mx-auto px-4">
                {/* სათაური */}
                <div className="flex items-center mb-6">
                    <div className={`w-1 h-12 ${colorClass} mr-3`}></div>
                    <div>
                        <h2 className="text-2xl font-bold">{platformName}</h2>
                        <p className="text-gray-400 text-sm">პოპულარული სერიალები</p>
                    </div>
                </div>

                {/* სერიალების მწკრივები */}
                {rows.map((rowShows, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="mb-8 group/row relative">
                        <div className="px-2">
                            <div
                                ref={el => { rowRefs.current[rowIndex] = el; }}
                                className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                            >
                                {/* სერიალების ქარდები */}
                                {rowShows.length > 0 ? (
                                    rowShows.map(show => (
                                        <TVShowCard key={show.id} show={show} />
                                    ))
                                ) : isLoading ? (
                                    // სკელეტონები ჩატვირთვისას
                                    [...Array(SHOWS_PER_ROW)].map((_, i) => (
                                        <div key={i} className="flex-none w-[250px] snap-start">
                                            <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                            <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
                                        </div>
                                    ))
                                ) : null}

                                {/* მეტის ჩვენების ღილაკი ბოლო მწკრივში */}
                                {rowIndex === rows.length - 1 && hasMore && (
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
                            {rowShows.length > 0 && (
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
                    </div>
                ))}

                {/* მეტის ჩვენების ღილაკი სექციის ბოლოში */}
                {hasMore && (
                    <div className="flex justify-center my-4">
                        <button
                            onClick={loadMore}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition-colors"
                        >
                            <span>მეტი სერიალის ნახვა</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TVPlatformSection;