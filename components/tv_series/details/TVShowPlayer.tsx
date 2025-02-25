"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Settings, ChevronDown, X, Maximize, Volume2, } from "lucide-react";
import Image from "next/image";

interface TVShow {
    id: number;
    title_geo: string;
    title_eng: string;
    poster_path_tmdb: string | null;
}

interface Episode {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    air_date: string | null;
    video_files?: {
        quality: string;
        url: string;
    }[];
}

interface TVShowPlayerProps {
    show: TVShow;
    season: number;
    episodeId?: number;
    onBack: () => void;
}

export default function TVShowPlayer({ show, season, episodeId, onBack }: TVShowPlayerProps) {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
    const [showQualitySelector, setShowQualitySelector] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState<string>("HD");
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    // სეზონის ეპიზოდების ჩატვირთვა
    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setLoading(true);
                setError(null);

                // API-დან ეპიზოდების ჩატვირთვა
                const response = await fetch(`/api/tv-series/${show.id}/seasons/${season}`);

                if (!response.ok) {
                    throw new Error("ეპიზოდების ჩატვირთვა ვერ მოხერხდა");
                }

                const data = await response.json();
                const fetchedEpisodes = data.episodes || [];

                if (fetchedEpisodes.length === 0) {
                    throw new Error("ამ სეზონის ეპიზოდები ვერ მოიძებნა");
                }

                setEpisodes(fetchedEpisodes);

                // თუ მოწოდებულია კონკრეტული ეპიზოდის ID, მაშინ ეს ეპიზოდი ავირჩიოთ
                // თუ არა, მაშინ პირველი ეპიზოდი
                let episodeToPlay: Episode | undefined;

                if (episodeId) {
                    episodeToPlay = fetchedEpisodes.find((ep: { id: number; }) => ep.id === episodeId);
                }

                setCurrentEpisode(episodeToPlay || fetchedEpisodes[0]);
            } catch (error) {
                console.error("Error fetching episodes:", error);
                setError(error instanceof Error ? error.message : "უცნობი შეცდომა");
            } finally {
                setLoading(false);
            }
        };

        fetchEpisodes();
    }, [show.id, season, episodeId]);

    // ვიდეო ლინკის მისაღებად - ამ შემთხვევაში სადემონსტრაციოდ
    const getVideoUrl = () => {
        if (!currentEpisode?.video_files?.length) {
            // რეალურ შემთხვევაში აქ იქნებოდა API კავშირი ვიდეო ფაილების მისაღებად
            // ამ შემთხვევაში დავაბრუნოთ ფიქტიური ლინკი დემოსთვის
            return "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";
        }

        // სასურველი ხარისხის ვიდეო ან სტანდარტული
        const videoFile = currentEpisode.video_files.find(v => v.quality === selectedQuality) ||
            currentEpisode.video_files[0];
        return videoFile.url;
    };

    // ეპიზოდის არჩევა
    const handleEpisodeSelect = (episode: Episode) => {
        setCurrentEpisode(episode);
        setShowEpisodeSelector(false);
    };

    // ხარისხის შეცვლა
    const handleQualityChange = (quality: string) => {
        setSelectedQuality(quality);
        setShowQualitySelector(false);
    };

    // ხმის ჩართვა/გამორთვა
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // სრულ ეკრანზე გადასვლა
    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // სრული ეკრანის მდგომარეობის თვალყურის დევნება
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* უკან დაბრუნების ღილაკი */}
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>უკან</span>
                </button>
            </div>

            {/* ფლეიერის კონტეინერი */}
            <div
                ref={playerContainerRef}
                className="relative w-full h-screen bg-black"
            >
                {loading ? (
                    // ჩატვირთვის ანიმაცია
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    // შეცდომის შეტყობინება
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-red-500 text-xl mb-4">{error}</p>
                        <button
                            onClick={onBack}
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md transition-colors"
                        >
                            უკან დაბრუნება
                        </button>
                    </div>
                ) : currentEpisode ? (
                    // ვიდეო ფლეიერი
                    <>
                        <video
                            ref={videoRef}
                            src={getVideoUrl()}
                            className="w-full h-full"
                            controls
                            autoPlay
                        />

                        {/* ინფორმაციის ზედა პანელი */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                            <div className="container mx-auto flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">{show.title_geo || show.title_eng}</h2>
                                    <p className="text-gray-300">
                                        სეზონი {season} | ეპიზოდი {currentEpisode.episode_number} - {currentEpisode.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* კონტროლები */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="container mx-auto flex justify-between items-center">
                                {/* ეპიზოდების არჩევანი */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowEpisodeSelector(!showEpisodeSelector)}
                                        className="flex items-center gap-2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-md pointer-events-auto transition-colors"
                                    >
                                        <span>ეპიზოდი {currentEpisode.episode_number}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* ეპიზოდების დროფდაუნ მენიუ */}
                                    {showEpisodeSelector && (
                                        <div className="absolute bottom-full left-0 mb-2 w-64 max-h-96 overflow-y-auto bg-gray-900 rounded-md shadow-lg pointer-events-auto">
                                            <div className="flex justify-between items-center p-2 border-b border-gray-800">
                                                <h3 className="font-medium">ეპიზოდები</h3>
                                                <button onClick={() => setShowEpisodeSelector(false)}>
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="p-2">
                                                {episodes.map((episode) => (
                                                    <button
                                                        key={episode.id}
                                                        onClick={() => handleEpisodeSelect(episode)}
                                                        className={`w-full text-left p-2 rounded-md transition-colors ${episode.id === currentEpisode.id
                                                            ? "bg-purple-700"
                                                            : "hover:bg-gray-800"
                                                            }`}
                                                    >
                                                        <div className="flex justify-between">
                                                            <span>{episode.episode_number}. {episode.name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* უკანა კონტროლები */}
                                <div className="flex items-center gap-3 pointer-events-auto">
                                    {/* ხმის კონტროლი */}
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 rounded-full hover:bg-black/50 transition-colors"
                                    >
                                        {isMuted ? (
                                            <div className="w-5 h-5" />
                                        ) : (
                                            <Volume2 className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* ხარისხის კონტროლი */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowQualitySelector(!showQualitySelector)}
                                            className="p-2 rounded-full hover:bg-black/50 transition-colors"
                                        >
                                            <Settings className="w-5 h-5" />
                                        </button>

                                        {/* ხარისხის დროფდაუნ მენიუ */}
                                        {showQualitySelector && (
                                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 rounded-md shadow-lg pointer-events-auto">
                                                <div className="flex justify-between items-center p-2 border-b border-gray-800">
                                                    <h3 className="font-medium">ხარისხი</h3>
                                                    <button onClick={() => setShowQualitySelector(false)}>
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="p-2">
                                                    {["4K", "HD", "SD"].map((quality) => (
                                                        <button
                                                            key={quality}
                                                            onClick={() => handleQualityChange(quality)}
                                                            className={`w-full text-left p-2 rounded-md transition-colors ${selectedQuality === quality
                                                                ? "bg-purple-700"
                                                                : "hover:bg-gray-800"
                                                                }`}
                                                        >
                                                            {quality}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* სრული ეკრანის კონტროლი */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2 rounded-full hover:bg-black/50 transition-colors"
                                    >
                                        <Maximize className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // ეპიზოდი ვერ მოიძებნა
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xl mb-4">ეპიზოდი ვერ მოიძებნა</p>
                        <button
                            onClick={onBack}
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md transition-colors"
                        >
                            უკან დაბრუნება
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}