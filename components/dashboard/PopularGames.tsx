// components/dashboard/PopularGames.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Play } from "lucide-react"
import Image from "next/image"
import useSWR from 'swr'

interface TVShow {
    id: number;
    title_eng: string;
    title_geo: string;
    imdb_vote: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | null;
    poster_logo: { logo_path: string } | null;
}

const FALLBACK_IMAGE = '/placeholder.svg';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PopularGames() {
    const { data, error, isLoading } = useSWR<{ series: TVShow[] }>('/api/tv-series?page=1&limit=8', fetcher);

    if (isLoading) {
        return <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>;
    }

    return (
        <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                    პოპულარული სერიალები <span className="text-gray-400 text-sm">({data?.series.length || 0})</span>
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.series.map((show) => (
                    <div key={show.id} className="bg-gray-900 rounded-xl overflow-hidden group">
                        <div className="aspect-video relative">
                            <Image
                                src={show.backdrop_poster_url ||
                                    (show.backdrop_path_tmdb ?
                                        `https://image.tmdb.org/t/p/w500${show.backdrop_path_tmdb}` :
                                        FALLBACK_IMAGE)
                                }
                                alt={show.title_geo}
                                fill
                                className="object-cover"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/50">
                                <Play className="w-8 h-8 text-white/90 hover:text-white" />
                            </div>

                            {/* IMDB Rating */}
                            {show.imdb_vote && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs">{show.imdb_vote}</span>
                                </div>
                            )}

                            {/* Show Logo */}
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
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-sm line-clamp-1">{show.title_geo}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-1">{show.title_eng}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {show.release_date && (
                                    <Badge variant="secondary">
                                        {new Date(show.release_date).getFullYear()}
                                    </Badge>
                                )}
                                <Badge variant="secondary" className="bg-pink-600">
                                    Series
                                </Badge>
                            </div>
                            <Button className="w-full mt-3 text-black" variant="outline">
                                <Play className="w-4 h-4 mr-2" />
                                Watch Now
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}