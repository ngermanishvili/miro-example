"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Play, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';


// Movie interface based on actual data structure
interface Movie {
    id: number;
    title_eng: string;
    title_geo: string;
    imdb_vote: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | number | null;
    poster_logo?: { logo_path: string } | null;
    homepage_url?: string | null;
}

interface MoviesApiResponse {
    movies: Movie[];
    page: number;
    limit: number;
    hasMore: boolean;
}

const FALLBACK_IMAGE = '/placeholder.svg';
const MOVIES_PER_SECTION = 8;

// Define streaming services with both company IDs and URL patterns
// Using the EXACT same IDs from your TV Shows component
const STREAMING_SERVICES = [
    {
        id: "149",
        name: "Netflix",
        platform: "netflix",
        urlPattern: "netflix",
        logo: "/assets/production-companies/netflix.png",
        colorClass: "bg-gradient-to-r from-netflix-red to-netflix-darkred"
    },
    {
        id: "2",
        name: "Disney",
        platform: "disneyplus",
        urlPattern: "disney",
        logo: "/assets/production-companies/disney.png",
        colorClass: "bg-gradient-to-r from-disney-blue to-disney-darkblue"
    },
    {
        id: "1342",
        name: "HBO",
        platform: "hbo",
        urlPattern: "hbo",
        logo: "/assets/production-companies/hbo.png",
        colorClass: "bg-gradient-to-r from-hbo-teal to-hbo-darkteal"
    },
    {
        id: "688",
        name: "Paramount",
        platform: "paramountplus",
        urlPattern: "paramount",
        logo: "/assets/production-companies/paramount.png",
        colorClass: "bg-gradient-to-r from-paramount-blue to-paramount-darkblue"
    },
    {
        id: "883",
        name: "Amazon",
        platform: "amazon",
        urlPattern: "amazon",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-amazon-teal to-amazon-darkteal"
    }
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (companyId: string, platform: string) =>
    (pageIndex: number, previousPageData: MoviesApiResponse | null) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return `/api/movies?page=${pageIndex + 1}&limit=${MOVIES_PER_SECTION}&companies=${companyId}&platform=${platform}`;
    };

export default function MoviesMainPage() {
    return (
        <div className="bg-black text-white">
            <main className="container mx-auto px-4 md:px-2 lg:px-2 py-8">
                {STREAMING_SERVICES.map((service) => (
                    <MovieStreamingSection
                        key={service.id}
                        companyId={service.id}
                        platform={service.platform}
                        urlPattern={service.urlPattern}
                        serviceName={service.name}
                        logo={service.logo}
                    />
                ))}
            </main>
        </div>
    );
}

function MovieStreamingSection({
    companyId,
    platform,
    urlPattern,
    serviceName,
    logo
}: {
    companyId: string;
    platform: string;
    urlPattern: string;
    serviceName: string;
    logo: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // პირველი ცდა API-ს გავლით
    const { data, error } = useSWR<MoviesApiResponse>(
        `/api/movies?page=1&limit=${MOVIES_PER_SECTION}&companies=${companyId}&platform=${platform}`,
        fetcher
    );

    // თუ API-დან ფილმები არ მოვიდა, ყველა ფილმი წამოვიღოთ და ლოკალურად გავფილტროთ
    useEffect(() => {
        async function fetchAndFilterMovies() {
            if (data) {
                if (data.movies && data.movies.length > 0) {
                    console.log(`Found ${data.movies.length} movies for ${serviceName} by API parameters`);
                    setMovies(data.movies);
                    setIsLoading(false);
                    return;
                }

                // თუ API-დან ფილმები არ მოვიდა, ყველა ფილმი წამოვიღოთ და URL-ით გავფილტროთ
                try {
                    console.log(`No movies found by API parameters for ${serviceName}, trying URL pattern filtering`);
                    const response = await fetch(`/api/movies?page=1&limit=200`);
                    const allData = await response.json();
                    const allMovies = allData.movies || [];

                    // ფილტრაცია URL პატერნით
                    const filteredMovies = allMovies.filter((movie: Movie) => {
                        const url = movie.homepage_url || "";
                        return url.toLowerCase().includes(urlPattern.toLowerCase());
                    });

                    console.log(`Found ${filteredMovies.length} movies for ${serviceName} by URL pattern`);
                    setMovies(filteredMovies);
                } catch (err) {
                    console.error(`Error fetching all movies:`, err);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        if (data || error) {
            fetchAndFilterMovies();
        }
    }, [data, error, serviceName, urlPattern]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // სექციას არ გამოვაჩენთ თუ ფილმები არ გვაქვს და ჩატვირთვაც დასრულებულია
    if (!isLoading && movies.length === 0) {
        return null;
    }


    return (
        <section className="mb-12 group/row">
            <div className='flex'>
                <div className="relative w-8 h-8 bg-white rounded-md mb-2">
                    <Image
                        src={logo}
                        alt={serviceName}
                        fill
                        className="object-contain"
                        loading="lazy"
                    />
                </div>
                <h2 className="text-2xl font-semibold mb-4 px-8">{serviceName}</h2>
            </div>

            <div className="relative px-8 hover:z-10">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide snap-x"
                >
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex-none w-[150px] snap-start">
                                <div className="h-[140px] w-[250px] bg-zinc-900 rounded-md animate-pulse" />
                                <div className="h-4 bg-zinc-900 rounded mt-2 w-2/4 animate-pulse" />
                            </div>
                        ))
                    ) : movies.length > 0 ? (
                        movies.map((movie) => (
                            movie && movie.id ? <MovieCard key={movie.id} movie={movie} /> : null
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 w-full">
                            No {serviceName} movies found
                        </div>
                    )}
                </div>

                {/* Navigation Arrows - Only show if there are movies */}
                {!isLoading && movies.length > 0 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 p-3 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 z-20"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        {/* Gradient overlays */}
                        <div className="absolute top-0 bottom-8 left-8 bg-gradient-to-r from-black via-black/50 to-transparent w-12" />
                        <div className="absolute top-0 bottom-8 right-8 bg-gradient-to-l from-black via-black/50 to-transparent w-12" />
                    </>
                )}
            </div>
        </section>
    );
}

function MovieCard({ movie }: { movie: Movie }) {
    const router = useRouter();
    const [imgSrc, setImgSrc] = useState(() => {
        // Always use TMDb path regardless of other URLs
        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w500${movie.backdrop_path_tmdb}`;
        }
        return FALLBACK_IMAGE;
    });

    const handleCardClick = () => {
        router.push(`/movies/${movie.id}`);
    };

    // Parse release date correctly
    let releaseYear = null;
    if (movie.release_date) {
        try {
            // Handle both date string and year number
            releaseYear = typeof movie.release_date === 'number'
                ? movie.release_date
                : new Date(movie.release_date).getFullYear();

            // Skip invalid years
            if (releaseYear === 1970) releaseYear = null;
        } catch (e) {
            console.error("Error parsing date:", movie.release_date);
        }
    }

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
                        loading="lazy"
                        onError={() => setImgSrc(FALLBACK_IMAGE)}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Poster Logo in the middle */}
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

                    {/* IMDB Rating */}
                    {movie.imdb_vote && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-white">
                                {parseFloat(movie.imdb_vote).toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Hover actions */}
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

            {/* Title and Info */}
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
}