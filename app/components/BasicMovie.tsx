"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Movie {
    id: number;
    title_eng: string;
    title_geo: string;
    imdb_vote: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | number | null;
    homepage_url?: string | null;
}

const FALLBACK_IMAGE = '/placeholder.svg';

export default function BasicMoviesList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMovies() {
            try {
                setLoading(true);
                const response = await fetch('/api/movies?page=1&limit=100');

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                console.log('Raw API response:', data);

                // Make sure we're accessing the movies correctly
                const moviesArray = data.movies || [];
                console.log(`Fetched ${moviesArray.length} movies`);

                setMovies(moviesArray);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    // Function to get image URL
    const getImageUrl = (movie: Movie) => {
        if (movie.backdrop_poster_url && movie.backdrop_poster_url !== "0") {
            try {
                const url = new URL(movie.backdrop_poster_url);
                if (url.hostname && url.protocol.startsWith('http')) {
                    return movie.backdrop_poster_url;
                }
            } catch {
                // Invalid URL, fall through to next option
            }
        }

        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w500${movie.backdrop_path_tmdb}`;
        }

        return FALLBACK_IMAGE;
    };

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">All Movies ({movies.length})</h1>

            {loading ? (
                <p className="text-center py-20">Loading movies...</p>
            ) : error ? (
                <div className="text-center py-20 text-red-500">
                    <p>Error: {error}</p>
                </div>
            ) : movies.length === 0 ? (
                <p className="text-center py-20">No movies found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {movies.map(movie => (
                        <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                            <div className="relative h-40">
                                <Image
                                    src={getImageUrl(movie)}
                                    alt={movie.title_eng || movie.title_geo}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Handle image error
                                        const target = e.target as HTMLImageElement;
                                        target.src = FALLBACK_IMAGE;
                                    }}
                                />

                                {/* IMDB Rating */}
                                {movie.imdb_vote && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                                        <Star className="w-3 h-3 text-yellow-400" />
                                        <span className="text-xs text-white">
                                            {parseFloat(movie.imdb_vote).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-3">
                                <h3 className="font-semibold truncate">{movie.title_geo || movie.title_eng}</h3>
                                {movie.title_eng && movie.title_geo && movie.title_eng !== movie.title_geo && (
                                    <p className="text-sm text-gray-400 truncate">{movie.title_eng}</p>
                                )}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400">
                                        {typeof movie.release_date === 'number'
                                            ? movie.release_date
                                            : movie.release_date
                                                ? new Date(movie.release_date).getFullYear()
                                                : 'N/A'
                                        }
                                    </span>
                                    <span className="text-xs bg-blue-900 px-2 py-1 rounded">ID: {movie.id}</span>
                                </div>
                                {movie.homepage_url && (
                                    <p className="text-xs text-blue-400 mt-1 truncate">
                                        {movie.homepage_url}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}