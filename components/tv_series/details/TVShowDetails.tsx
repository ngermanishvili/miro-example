"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Star, Play, Calendar, Clock } from "lucide-react";
import TVShowEpisodes from "./TVShowEpisodes";
import TVShowPlayer from "./TVShowPlayer";
import SimilarTVShows from "./SimilarTVShows";

interface Genre {
    id: number;
    name: string;
}

interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
}

interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
    character_name: string;
    order: number;
}

interface TVShow {
    id: number;
    title_geo: string;
    title_eng: string;
    overview_geo: string | null;
    overview_eng: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    poster_path_tmdb: string | null;
    imdb_vote: number | null;
    release_date: string | null;
    last_air_date: string | null;
    homepage_url: string | null;
    number_of_seasons: number | null;
    number_of_episodes: number | null;
    genres: Genre[];
    production_companies: ProductionCompany[];
    cast_members: CastMember[];
}

interface TVShowDetailsProps {
    show: TVShow;
}

const FALLBACK_IMAGE = "/placeholder-backdrop.jpg";

export default function TVShowDetails({ show }: TVShowDetailsProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isPlayMode, setIsPlayMode] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [backdropSrc, setBackdropSrc] = useState(() => {
        if (show.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/original${show.backdrop_path_tmdb}`;
        } else if (show.backdrop_poster_url) {
            return show.backdrop_poster_url;
        }
        return FALLBACK_IMAGE;
    });

    // გამოთვლილი მონაცემები
    const releaseYear = show.release_date
        ? new Date(show.release_date).getFullYear()
        : null;
    const description = show.overview_geo || show.overview_eng || "";
    const shouldTruncate = description.length > 300;
    const truncatedDescription = shouldTruncate
        ? `${description.substring(0, 300)}...`
        : description;

    const handlePlayClick = () => {
        setIsPlayMode(true);
        // ავტომატურად გადავდივართ პლეიერთან
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSeasonChange = (season: number) => {
        setSelectedSeason(season);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {isPlayMode ? (
                // პლეიერის ვიუ
                <TVShowPlayer
                    show={show}
                    season={selectedSeason}
                    onBack={() => setIsPlayMode(false)}
                />
            ) : (
                <>
                    {/* ჰერო სექცია - ბანერი და სათაური */}
                    <div className="relative h-[70vh] w-full">
                        <div className="absolute inset-0">
                            <Image
                                src={backdropSrc}
                                alt={show.title_geo || show.title_eng}
                                fill
                                className="object-cover"
                                onError={() => setBackdropSrc(FALLBACK_IMAGE)}
                                priority
                            />

                            {/* გრადიენტი */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        </div>

                        {/* სერიალის ინფორმაცია */}
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                            <div className="container mx-auto">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* პოსტერი */}
                                    <div className="hidden md:block flex-shrink-0 w-64 h-96 relative rounded-lg overflow-hidden shadow-xl">
                                        <Image
                                            src={
                                                show.poster_path_tmdb
                                                    ? `https://image.tmdb.org/t/p/w500${show.poster_path_tmdb}`
                                                    : "/placeholder-poster.jpg"
                                            }
                                            alt={show.title_geo || show.title_eng}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* სერიალის დეტალები */}
                                    <div className="flex-grow">
                                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                            {show.title_geo || show.title_eng}
                                        </h1>

                                        {show.title_geo && show.title_eng && show.title_geo !== show.title_eng && (
                                            <h2 className="text-xl md:text-2xl text-gray-300 mb-4">
                                                {show.title_eng}
                                            </h2>
                                        )}

                                        {/* მეტა ინფორმაცია */}
                                        <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                                            {show.imdb_vote && (
                                                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                    <span>
                                                        {typeof show.imdb_vote === "number"
                                                            ? show.imdb_vote.toFixed(1)
                                                            : parseFloat(String(show.imdb_vote)).toFixed(1)}
                                                    </span>
                                                </div>
                                            )}

                                            {releaseYear && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{releaseYear}</span>
                                                </div>
                                            )}

                                            {show.number_of_seasons && (
                                                <div className="flex items-center gap-1">
                                                    <span>
                                                        {show.number_of_seasons} სეზონი
                                                        {show.number_of_episodes
                                                            ? ` • ${show.number_of_episodes} ეპიზოდი`
                                                            : ""}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ჟანრები */}
                                        {show.genres && show.genres.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {show.genres.map((genre) => (
                                                    <span
                                                        key={genre.id}
                                                        className="px-3 py-1 bg-gray-800 text-sm rounded-full"
                                                    >
                                                        {genre.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* აღწერა */}
                                        <div className="mb-8">
                                            <p className="text-gray-300">
                                                {showFullDescription ? description : truncatedDescription}
                                            </p>
                                            {shouldTruncate && (
                                                <button
                                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                                    className="mt-2 text-purple-400 flex items-center"
                                                >
                                                    {showFullDescription ? (
                                                        <>
                                                            <span>ნაკლები</span>
                                                            <ChevronUp className="w-4 h-4 ml-1" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>მეტი</span>
                                                            <ChevronDown className="w-4 h-4 ml-1" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* ღილაკები */}
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={handlePlayClick}
                                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-md font-medium transition-colors"
                                            >
                                                <Play className="w-5 h-5" />
                                                <span>ყურება</span>
                                            </button>

                                            {show.homepage_url && (
                                                <a
                                                    href={show.homepage_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
                                                >
                                                    <span>ოფიციალური გვერდი</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* კონტენტის სექცია */}
                    <div className="container mx-auto py-10 px-6">
                        {/* ეპიზოდები */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-bold mb-6">ეპიზოდები</h3>
                            <TVShowEpisodes
                                showId={show.id}
                                totalSeasons={show.number_of_seasons || 1}
                                selectedSeason={selectedSeason}
                                onSeasonChange={handleSeasonChange}
                                onEpisodeClick={handlePlayClick}
                            />
                        </section>

                        {/* მსახიობები */}
                        {show.cast_members && show.cast_members.length > 0 && (
                            <section className="mb-16">
                                <h3 className="text-2xl font-bold mb-6">მსახიობები</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {show.cast_members.map((actor) => (
                                        <div key={`${actor.id}-${actor.character_name}`} className="bg-gray-900 rounded-md overflow-hidden">
                                            <div className="aspect-[2/3] relative">
                                                <Image
                                                    src={
                                                        actor.profile_path
                                                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                                            : "/placeholder-person.jpg"
                                                    }
                                                    alt={actor.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-medium text-sm">{actor.name}</h4>
                                                <p className="text-gray-400 text-xs line-clamp-1">
                                                    {actor.character_name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* პროდაქშენ კომპანიები */}
                        {show.production_companies && show.production_companies.length > 0 && (
                            <section className="mb-16">
                                <h3 className="text-2xl font-bold mb-6">პროდიუსერები</h3>
                                <div className="flex flex-wrap gap-6">
                                    {show.production_companies.map((company) => (
                                        <div
                                            key={company.id}
                                            className="flex items-center bg-gray-900 p-3 rounded-md"
                                        >
                                            {company.logo_path ? (
                                                <div className="w-12 h-12 relative mr-3">
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                        alt={company.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : null}
                                            <span>{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* მსგავსი სერიალები */}
                        <section>
                            <h3 className="text-2xl font-bold mb-6">მსგავსი სერიალები</h3>
                            <SimilarTVShows showId={show.id} genres={show.genres} />
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}