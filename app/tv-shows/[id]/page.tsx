// app/tv-series/[id]/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import { Play, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from '@/components/tv-series/VideoPlayerTV';
import EpisodeList from '@/components/tv-series/EpisodeList';
import CastList from "@/components/tv-series/CastList";
import type { TVShow, Episode } from "@/types/tv";

export default function TVShowDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [show, setShow] = useState<TVShow | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShow = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tv-full/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch show data');
                }
                const data = await response.json();
                setShow(data);

                // ეპიზოდის არჩევა URL-იდან
                const seasonParam = searchParams.get('season');
                const episodeParam = searchParams.get('episode');

                if (data.episodes && seasonParam && episodeParam) {
                    const episode = data.episodes.find((ep: Episode) =>  // დავამატეთ ექსპლიციტური ტიპი
                        ep.season === parseInt(seasonParam) &&
                        ep.episode === parseInt(episodeParam)
                    );
                    if (episode) {
                        setSelectedEpisode(episode);
                    } else {
                        setSelectedEpisode(data.episodes[0]);
                    }
                } else if (data.episodes && data.episodes.length > 0) {
                    setSelectedEpisode(data.episodes[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchShow();
        }
    }, [params.id, searchParams]);

    const handleEpisodeSelect = (episode: Episode) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('season', episode.season.toString());
        newParams.set('episode', episode.episode.toString());
        router.replace(`?${newParams.toString()}`, { scroll: false });
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error || !show) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">შეცდომა</h1>
                    <p className="text-gray-400">{error || 'სერიალის ჩატვირთვა ვერ მოხერხდა'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative h-[56.25vw]">
                <Image
                    src={show.backdrop_poster_url ||
                        (show.backdrop_path_tmdb ?
                            `https://image.tmdb.org/t/p/original${show.backdrop_path_tmdb}` :
                            "/placeholder.svg")}
                    alt={show.title_eng}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 space-y-4 max-w-2xl">
                    <h1 className="text-5xl font-bold">{show.title_geo}</h1>
                    <h2 className="text-2xl text-gray-300">{show.title_eng}</h2>
                    <div className="flex items-center space-x-2 text-sm">
                        {show.imdb_vote && (
                            <Badge variant="secondary" className="bg-yellow-500 text-black">
                                <Star className="w-3 h-3 mr-1" />
                                IMDb {show.imdb_vote}
                            </Badge>
                        )}
                        {show.release_date && (
                            <span>{new Date(show.release_date).getFullYear()}</span>
                        )}
                    </div>
                    <p className="text-lg">{show.description}</p>
                    <div className="flex items-center space-x-4">
                        {selectedEpisode && (
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200"
                                onClick={() => handleEpisodeSelect(selectedEpisode)}
                            >
                                <Play className="mr-2 h-5 w-5" /> ყურება
                            </Button>
                        )}
                        <Button size="lg" variant="outline">
                            <Plus className="mr-2 h-5 w-5" /> ჩემს სიაში
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Video Player Section */}
                <div className="mb-8">
                    <VideoPlayer
                        videoUrl={selectedEpisode?.video_url || null}
                    />
                </div>

                {/* ეპიზოდის ინფორმაცია */}
                {selectedEpisode && (
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">
                            {selectedEpisode.season} სეზონი, ეპიზოდი {selectedEpisode.episode}: {selectedEpisode.title}
                        </h2>
                        <p className="text-gray-300">{selectedEpisode.overview}</p>
                    </div>
                )}

                {/* Episodes Section */}
                {show.episodes && show.episodes.length > 0 && (
                    <div className="mb-8">
                        <EpisodeList
                            episodes={show.episodes}
                            onEpisodeSelect={handleEpisodeSelect}
                            selectedEpisode={selectedEpisode}
                        />
                    </div>
                )}

                {/* Cast Section */}
                {show.cast_members && show.cast_members.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">მსახიობები</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {show.cast_members.map((member) => (
                                <div key={member.id} className="bg-zinc-900 rounded-lg p-4">
                                    <div className="relative aspect-square mb-2">
                                        <Image
                                            src={member.profile_path ?
                                                `https://image.tmdb.org/t/p/w200${member.profile_path}` :
                                                "/placeholder.svg"}
                                            alt={member.name}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    {member.character_name && (
                                        <p className="text-sm text-gray-400">{member.character_name}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Production Companies Section */}
                {show.production_companies && show.production_companies.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">მწარმოებელი კომპანიები</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {show.production_companies.map(company => (
                                <div
                                    key={company.id}
                                    className="bg-zinc-900 rounded-lg p-4 flex items-center gap-3"
                                >
                                    {company.logo_path && (
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                alt={company.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <span className="text-sm">{company.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Genres Section */}
                {show.genres && show.genres.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">ჟანრები</h2>
                        <div className="flex flex-wrap gap-2">
                            {show.genres.map(genre => (
                                <Badge key={genre.id} variant="outline" className="text-sm">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}