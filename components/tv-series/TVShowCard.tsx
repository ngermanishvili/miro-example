// components/tv-series/TVShowCard.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Play, Plus } from 'lucide-react';
import type { TVShow } from '@/types';
import { FALLBACK_IMAGE } from '@/types';

interface TVShowCardProps {
    show: TVShow;
}

export default function TVShowCard({ show }: TVShowCardProps) {
    const router = useRouter();

    // ვალიდაცია prop-ზე
    if (!show) {
        return null;
    }

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

    const handleCardClick = () => {
        router.push(`/tv-shows/${show.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex-none w-[250px] transition-transform duration-300 group cursor-pointer"
            onClick={handleCardClick}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

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

                    {show.imdb_vote && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white">
                                {parseFloat(show.imdb_vote).toFixed(1)}
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                            className="bg-white text-black p-2 rounded-full mr-2 hover:bg-opacity-80 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Play onClick={handleCardClick} className="w-6 h-6" />
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