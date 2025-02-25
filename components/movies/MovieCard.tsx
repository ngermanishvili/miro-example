// components/movies/MovieCard.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Play, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Movie {
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

interface MovieCardProps {
    movie: Movie;
    priority?: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';

const MovieCard: React.FC<MovieCardProps> = ({ movie, priority = false }) => {
    const router = useRouter();

    // სურათის წყაროს ლოგიკა - პრიორიტეტი TMDB-ს 
    const [imgSrc, setImgSrc] = useState(() => {
        // Always prioritize TMDB path if it exists
        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w300${movie.backdrop_path_tmdb}`;
        }

        // Only use backdrop_poster_url as fallback if TMDB is not available
        if (movie.backdrop_poster_url) {
            try {
                const url = new URL(movie.backdrop_poster_url);
                if (url.hostname && url.protocol.startsWith('http')) {
                    return movie.backdrop_poster_url;
                }
            } catch {
                return FALLBACK_IMAGE;
            }
        }

        return FALLBACK_IMAGE;
    });

    const handleCardClick = () => {
        router.push(`/movies/${movie.id}`);
    };

    // წლის გამოთვლა
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

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
                        alt={movie.title_eng || `${movie.title_geo} cover`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover rounded-md"
                        loading={priority ? "eager" : "lazy"}
                        onError={() => setImgSrc(FALLBACK_IMAGE)}
                        unoptimized={!imgSrc.startsWith('https://image.tmdb.org')}
                    />

                    {/* გრადიენტი სურათზე */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* ლოგო შუაში (თუ არსებობს) */}
                    {movie.poster_logo?.logo_path && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-12">
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_logo.logo_path}`}
                                alt="Logo"
                                fill
                                className="object-contain object-center"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* IMDB რეიტინგი */}
                    {movie.imdb_vote && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white">
                                {typeof movie.imdb_vote === 'number'
                                    ? movie.imdb_vote.toFixed(1)
                                    : parseFloat(movie.imdb_vote).toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Hover-ზე გამოჩენილი ღილაკები */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                            className="bg-white text-black p-2 rounded-full mr-2 hover:bg-opacity-80 transition-all duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick();
                            }}
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

            {/* სათაური და ინფორმაცია */}
            <div className="mt-2 px-1">
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 line-clamp-1">
                    {movie.title_geo || movie.title_eng}
                </p>
                {movie.title_geo && movie.title_eng && (
                    <p className="text-xs text-gray-400 line-clamp-1">
                        {movie.title_geo !== movie.title_eng ? movie.title_eng : ''}
                    </p>
                )}
                {releaseYear && (
                    <p className="text-xs text-gray-400 mt-1">
                        {releaseYear}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default MovieCard;