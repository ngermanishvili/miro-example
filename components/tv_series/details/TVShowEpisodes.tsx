"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface Episode {
    id: number;
    name: string;
    overview: string | null;
    episode_number: number;
    air_date: string | null;
    still_path: string | null;
    runtime: number | null;
}

interface Season {
    season_number: number;
    episodes: Episode[];
    loading: boolean;
    error: string | null;
}

interface TVShowEpisodesProps {
    showId: number;
    selectedSeason: number;
    totalSeasons: number;
    onSeasonChange: (season: number) => void;
    onEpisodeClick: (episodeId: number) => void;
}

export default function TVShowEpisodes({
    showId,
    selectedSeason,
    totalSeasons,
    onSeasonChange,
    onEpisodeClick,
}: TVShowEpisodesProps) {
    const [seasons, setSeasons] = useState<Record<number, Season>>({});

    // სეზონის ეპიზოდების ჩატვირთვა
    useEffect(() => {
        // თუ უკვე ჩატვირთულია ან მიმდინარეობს ჩატვირთვა, გამოვტოვოთ
        if (
            seasons[selectedSeason] &&
            (seasons[selectedSeason].episodes.length > 0 || seasons[selectedSeason].loading)
        ) {
            return;
        }

        // დავნიშნოთ ჩატვირთვის მდგომარეობა
        setSeasons((prev) => ({
            ...prev,
            [selectedSeason]: {
                season_number: selectedSeason,
                episodes: [],
                loading: true,
                error: null,
            },
        }));

        // ეპიზოდების ჩატვირთვა API-დან
        const fetchEpisodes = async () => {
            try {
                const response = await fetch(
                    `/api/tv-series/${showId}/seasons/${selectedSeason}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch episodes");
                }

                const data = await response.json();

                setSeasons((prev) => ({
                    ...prev,
                    [selectedSeason]: {
                        season_number: selectedSeason,
                        episodes: data.episodes || [],
                        loading: false,
                        error: null,
                    },
                }));
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setSeasons((prev) => ({
                    ...prev,
                    [selectedSeason]: {
                        ...prev[selectedSeason],
                        loading: false,
                        error: "სეზონის ეპიზოდების ჩატვირთვა ვერ მოხერხდა",
                    },
                }));
            }
        };

        fetchEpisodes();
    }, [showId, selectedSeason, seasons]);

    // აქტიური სეზონის მონაცემები
    const currentSeason = seasons[selectedSeason] || {
        season_number: selectedSeason,
        episodes: [],
        loading: true,
        error: null,
    };

    // ეპიზოდზე დაჭერის ფუნქცია
    const handleEpisodeClick = (episodeId: number) => {
        onEpisodeClick(episodeId);
    };

    // სეზონის არჩევის კომპონენტი
    const renderSeasonSelector = () => {
        const seasonOptions = [];

        for (let i = 1; i <= totalSeasons; i++) {
            seasonOptions.push(
                <button
                    key={i}
                    onClick={() => onSeasonChange(i)}
                    className={`px-4 py-2 rounded-md transition-colors ${selectedSeason === i
                            ? "bg-purple-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                >
                    სეზონი {i}
                </button>
            );
        }

        return (
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                {seasonOptions}
            </div>
        );
    };

    return (
        <div>
            {/* სეზონები */}
            {renderSeasonSelector()}

            {/* ეპიზოდები */}
            <div className="space-y-4">
                {currentSeason.loading ? (
                    // ჩატვირთვის სკელეტონი
                    <>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col md:flex-row bg-gray-900 rounded-md overflow-hidden animate-pulse"
                            >
                                <div className="w-full md:w-64 h-36 bg-gray-800" />
                                <div className="p-4 flex-grow">
                                    <div className="h-6 bg-gray-800 rounded w-1/3 mb-2" />
                                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-4" />
                                    <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                                    <div className="h-4 bg-gray-800 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : currentSeason.error ? (
                    // შეცდომის შეტყობინება
                    <div className="text-center p-6 bg-gray-900 rounded-md">
                        <p className="text-red-400">{currentSeason.error}</p>
                    </div>
                ) : currentSeason.episodes.length === 0 ? (
                    // ეპიზოდები არ მოიძებნა
                    <div className="text-center p-6 bg-gray-900 rounded-md">
                        <p className="text-gray-400">ამ სეზონის ეპიზოდები ვერ მოიძებნა</p>
                    </div>
                ) : (
                    // ეპიზოდების ჩვენება
                    <>
                        {currentSeason.episodes.map((episode) => (
                            <div
                                key={episode.id}
                                className="flex flex-col md:flex-row bg-gray-900 rounded-md overflow-hidden transition-colors hover:bg-gray-800 group cursor-pointer"
                                onClick={() => handleEpisodeClick(episode.id)}
                            >
                                {/* ეპიზოდის სურათი */}
                                <div className="relative w-full md:w-64 h-36">
                                    <Image
                                        src={
                                            episode.still_path
                                                ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                                : "/placeholder-episode.jpg"
                                        }
                                        alt={episode.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* ზედდო გრადიენტი */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Play className="w-12 h-12 text-white" />
                                    </div>

                                    {/* ეპიზოდის ნომერი */}
                                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-sm">
                                        {episode.episode_number}
                                    </div>
                                </div>

                                {/* ეპიზოდის ინფორმაცია */}
                                <div className="p-4 flex-grow">
                                    <h4 className="font-medium text-lg group-hover:text-purple-400 transition-colors">
                                        {episode.name}
                                    </h4>

                                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                                        {episode.air_date && (
                                            <span>
                                                {new Date(episode.air_date).toLocaleDateString("ka-GE", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}

                                        {episode.runtime && <span>{episode.runtime} წთ</span>}
                                    </div>

                                    {episode.overview && (
                                        <p className="text-gray-300 text-sm line-clamp-2">
                                            {episode.overview}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}