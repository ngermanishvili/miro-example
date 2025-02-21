// components/dashboard/RecommendedGames.tsx

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star } from "lucide-react"
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
}

const FALLBACK_IMAGE = '/placeholder.svg';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function RecommendedGames() {
    const { data, error, isLoading } = useSWR<{ series: TVShow[] }>('/api/tv-series?page=1&limit=4', fetcher);

    if (isLoading) {
        return <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>;
    }

    if (!data?.series) return null;

    return (
        <div className="w-full md:w-72">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                    რეკომენდებული <span className="text-gray-400 text-sm">({data.series.length})</span>
                </h2>
            </div>
            <div className="space-y-3">
                {data.series.map((show) => (
                    <div key={show.id} className="flex items-center gap-3 p-2 bg-gray-900 rounded-lg group hover:bg-gray-800 transition-colors">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
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
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                                {show.title_geo}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                {show.imdb_vote && (
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400" />
                                        <span className="text-xs">{show.imdb_vote}</span>
                                    </div>
                                )}
                                {show.release_date && (
                                    <span className="text-xs text-gray-400">
                                        {new Date(show.release_date).getFullYear()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}