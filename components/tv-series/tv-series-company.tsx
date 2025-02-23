"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import useSWRInfinite from 'swr/infinite';
import { useState } from 'react';

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

const STREAMING_SERVICES = [
    { id: "149", name: "Netflix", platform: "netflix" },
    { id: "2", name: "Disney", platform: "disneyplus" },
    { id: "1342", name: "HBO", platform: "hbo" },
    { id: "688", name: "Paramount", platform: "paramountplus" },
    { id: "883", name: "Amazon", platform: "amazon" }
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
            <main className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
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

    const { data, error, size, setSize, isValidating } = useSWRInfinite<TVShowsApiResponse>(
        (pageIndex, previousPageData) => getKey(companyId, platform)(pageIndex, previousPageData),
        fetcher,
        { revalidateFirstPage: false, revalidateOnFocus: false }
    );

    const shows = data?.flatMap(page => page.series) || [];
    const isLoading = !data && !error;
    const hasMore = data?.[data.length - 1]?.hasMore || false;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{serviceName} Shows</h2>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                    {[...Array(SHOWS_PER_SECTION)].map((_, i) => (
                        <div key={i} className="aspect-video bg-zinc-900 rounded-sm animate-pulse" />
                    ))}
                </div>
            ) : shows.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                        {shows.map((show) => (
                            <TVShowCard key={show.id} show={show} />
                        ))}
                    </div>

                    {/* {hasMore && (
                        <button
                            onClick={() => setSize(size + 1)}
                            disabled={isValidating}
                            className="mt-8 mx-auto block bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md"
                        >
                            {isValidating ? 'Loading...' : 'Load More'}
                        </button>
                    )} */}
                </>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    No {serviceName} shows found
                </div>
            )}
        </section>
    );
}

function TVShowCard({ show }: { show: TVShow }) {
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
            className="relative group cursor-pointer"
        >
            <div className="relative aspect-video rounded-sm overflow-hidden bg-zinc-900">
                <Image
                    src={imgSrc}
                    alt={show.title_eng || `${show.title_geo} cover`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                    unoptimized={!imgSrc.startsWith('https://image.tmdb.org')}
                />

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {show.poster_logo?.logo_path && (
                    <div className="absolute bottom-2 left-2 w-[70%] h-8">
                        <Image
                            src={`https://image.tmdb.org/t/p/w200${show.poster_logo.logo_path}`}
                            alt="Logo"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                )}

                {show.imdb_vote && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-white">
                            {parseFloat(show.imdb_vote).toFixed(1)}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/50">
                    <Play className="w-8 h-8 text-white/90 hover:text-white" />
                </div>
            </div>

            <div className="mt-2 space-y-1 px-1">
                {show.title_geo && show.title_eng && (
                    <>
                        <p className="text-xs font-medium line-clamp-1 text-gray-100">
                            {show.title_geo}
                        </p>
                        <p className="text-xs line-clamp-1 text-gray-400">
                            {show.title_eng}
                        </p>
                    </>
                )}
                {(show.title_geo || show.title_eng) && !(show.title_geo && show.title_eng) && (
                    <p className="text-xs font-medium line-clamp-2 text-gray-100">
                        {show.title_geo || show.title_eng}
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