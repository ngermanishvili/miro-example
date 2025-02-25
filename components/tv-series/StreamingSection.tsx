// components/tv-series/StreamingSection.tsx
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useSWRInfinite from 'swr/infinite';
import type { StreamingSectionProps, TVShowsApiResponse } from '@/types';
import { SHOWS_PER_SECTION, STREAMING_SERVICES } from '@/types';
import TVShowCard from './TVShowCard';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (companyId: string, platform: string) =>
    (pageIndex: number, previousPageData: TVShowsApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return `/api/tv-series?page=${pageIndex + 1}&limit=${SHOWS_PER_SECTION}&companies=${companyId}&platform=${platform}`;
    };

export default function StreamingSection({ companyId, platform, serviceName }: StreamingSectionProps) {
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
            <div className='flex'>
                <div className="relative w-8 h-8 bg-white rounded-md mb-2">
                    <Image
                        src={service.logo}
                        alt={service.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                    />
                </div>
                <h2 className="text-2xl font-semibold mb-4 px-8">{serviceName}</h2>
            </div>

            <div className="relative px-8 hover:z-10">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide snap-x"
                >
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex-none w-[150px] snap-start">
                                <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
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
}