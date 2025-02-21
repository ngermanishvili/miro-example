// components/tv-series/RelatedContent.tsx
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

interface Show {
    id: number;
    title_eng: string;
    title_geo: string;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    imdb_vote: string | null;
    release_date: string | null;
}

interface RelatedContentProps {
    shows: Show[];
}

export default function RelatedContent({ shows }: RelatedContentProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">მსგავსი სერიალები</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shows.map((show) => (
                    <Link href={`/tv-shows/${show.id}`} key={show.id}
                        className="relative group cursor-pointer">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
                            <Image
                                src={show.backdrop_poster_url ||
                                    (show.backdrop_path_tmdb ?
                                        `https://image.tmdb.org/t/p/w500${show.backdrop_path_tmdb}` :
                                        "/placeholder.svg")}
                                alt={show.title_geo}
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Rating */}
                            {show.imdb_vote && (
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs">{show.imdb_vote}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-2">
                            <h3 className="text-sm font-medium truncate">{show.title_geo}</h3>
                            <p className="text-xs text-gray-400 truncate">{show.title_eng}</p>
                            {show.release_date && (
                                <p className="text-xs text-gray-500">
                                    {new Date(show.release_date).getFullYear()}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}