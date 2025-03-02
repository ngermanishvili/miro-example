"use client";

import { useState, useRef, useEffect } from 'react';
import { Movie } from '@/types/search';
import { Star, Search, X, Play, Plus, Info } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResponse {
    success: boolean;
    query: string;
    count: number;
    results: Movie[];
    error?: string;
}

interface MovieSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FALLBACK_IMAGE = '/placeholder.svg';

const MovieSearchModal = ({ isOpen, onClose }: MovieSearchModalProps) => {
    const [query, setQuery] = useState<string>('');
    const [status, setStatus] = useState<{ message: string; isError: boolean }>({
        message: 'მზადაა საძიებლად. ჩაწერეთ ფილმის სახელი ქართულად ან ინგლისურად.',
        isError: false,
    });
    const [results, setResults] = useState<Movie[]>([]);
    const [resultCount, setResultCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            // Focus input when modal opens
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 100);
        } else {
            // Clear search when modal closes
            setQuery('');
            setResults([]);
            setResultCount(0);
            setFeaturedMovie(null);
            setStatus({
                message: 'მზადაა საძიებლად. ჩაწერეთ ფილმის სახელი ქართულად ან ინგლისურად.',
                isError: false,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        // Close modal on ESC key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restore body scroll when modal is closed
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const showStatus = (message: string, isError: boolean = false) => {
        setStatus({ message, isError });
    };

    // Get image path with proper fallback handling
    const getImagePath = (movie: Movie, large = false) => {
        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/${large ? 'w1280' : 'w300'}${movie.backdrop_path_tmdb}`;
        }

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
    };

    const performSearch = async () => {
        if (!query.trim()) {
            showStatus('გთხოვთ შეიყვანოთ საძიებო სიტყვა', true);
            return;
        }

        setIsLoading(true);
        showStatus(`მიმდინარეობს ძიება: "${query}"...`);

        try {
            const response = await fetch(`http://localhost:8080/api/search?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: SearchResponse = await response.json();

            if (data.count > 0) {
                showStatus(`ნაპოვნია ${data.count} შედეგი: "${data.query}"`);
                setResults(data.results);
                setResultCount(data.count);

                // Set a featured movie (first one with a high rating)
                const highRatedMovie = data.results.find(movie => movie.imdb_vote && movie.imdb_vote > 7.5);
                setFeaturedMovie(highRatedMovie || data.results[0]);
            } else {
                showStatus(`არ მოიძებნა შედეგი: "${data.query}"`, true);
                setResults([]);
                setResultCount(0);
                setFeaturedMovie(null);
            }
        } catch (err) {
            showStatus(`ძიების შეცდომა: ${err instanceof Error ? err.message : 'უცნობი შეცდომა'}`, true);
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    // Function to handle movie selection
    const handleSelectMovie = (movie: Movie) => {
        console.log('Selected movie:', movie);
        // You can add navigation or any other action here
        onClose();
    };

    // Get release year from date
    const getReleaseYear = (releaseDate: string | undefined | null) => {
        if (!releaseDate) return null;
        return new Date(releaseDate).getFullYear();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/95 overflow-hidden"
                >
                    {/* Search Header */}
                    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent pt-6 pb-16 px-6 lg:px-12">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex-1 max-w-2xl mx-auto relative">
                                <div className="flex items-center bg-gray-900/80 border border-gray-700 rounded-md overflow-hidden">
                                    <Search className="ml-4 text-gray-400" size={20} />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyUp={handleKeyPress}
                                        placeholder="ფილმის ძიება ქართულად ან ინგლისურად..."
                                        className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery('')}
                                            className="text-gray-400 hover:text-white mr-2"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={performSearch}
                                        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'ძიება...' : 'ძიება'}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 text-gray-400 hover:text-white"
                                aria-label="Close search"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Status message */}
                        {status.message && (
                            <div className={`max-w-2xl mx-auto p-3 rounded-md text-sm ${status.isError
                                ? 'text-red-200'
                                : 'text-gray-300'
                                }`}>
                                {status.message}
                            </div>
                        )}
                    </div>

                    {/* Main content area */}
                    <div className="pt-28 pb-16 px-6 lg:px-12 overflow-y-auto h-full">
                        {/* Featured movie (when available) */}
                        {featuredMovie && results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative w-full h-96 mb-12 rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={getImagePath(featuredMovie, true)}
                                    alt={featuredMovie.title_eng || featuredMovie.title_geo}
                                    fill
                                    priority
                                    className="object-cover"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h2 className="text-4xl font-bold mb-2">
                                        {featuredMovie.title_geo || featuredMovie.title_eng}
                                    </h2>
                                    {featuredMovie.title_geo && featuredMovie.title_eng && featuredMovie.title_geo !== featuredMovie.title_eng && (
                                        <h3 className="text-xl text-gray-300 mb-4">
                                            {featuredMovie.title_eng}
                                        </h3>
                                    )}

                                    <div className="flex items-center gap-4 mb-6">
                                        {featuredMovie.imdb_vote && (
                                            <div className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-sm">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm text-white">
                                                    {typeof featuredMovie.imdb_vote === 'number'
                                                        ? featuredMovie.imdb_vote.toFixed(1)
                                                        : parseFloat(String(featuredMovie.imdb_vote)).toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                        {featuredMovie.release_date && (
                                            <div className="text-sm text-gray-300">
                                                {getReleaseYear(featuredMovie.release_date)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleSelectMovie(featuredMovie)}
                                            className="bg-white hover:bg-gray-200 text-black flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors"
                                        >
                                            <Play size={20} />
                                            <span>ნახვა</span>
                                        </button>
                                        <button className="bg-gray-600/60 hover:bg-gray-600 text-white flex items-center gap-2 px-6 py-2 rounded-md transition-colors">
                                            <Info size={20} />
                                            <span>დეტალები</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Results grid */}
                        {results.length > 0 ? (
                            <div>
                                <h3 className="text-xl font-medium mb-4">ძიების შედეგები</h3>
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ staggerChildren: 0.05 }}
                                >
                                    {results.map((movie) => (
                                        <motion.div
                                            key={movie.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.05, zIndex: 1 }}
                                            className="cursor-pointer transition-all duration-300 group"
                                            onClick={() => handleSelectMovie(movie)}
                                        >
                                            <div className="relative aspect-video rounded-md overflow-hidden shadow-lg">
                                                <Image
                                                    src={getImagePath(movie)}
                                                    alt={movie.title_eng || movie.title_geo}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                    className="object-cover rounded-md"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = FALLBACK_IMAGE;
                                                    }}
                                                    unoptimized={!getImagePath(movie).startsWith('https://image.tmdb.org')}
                                                />

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* IMDB rating */}
                                                {movie.imdb_vote && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                                                        <Star className="w-3 h-3 text-yellow-400" />
                                                        <span className="text-xs text-white">
                                                            {typeof movie.imdb_vote === 'number'
                                                                ? movie.imdb_vote.toFixed(1)
                                                                : parseFloat(String(movie.imdb_vote)).toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Hover buttons */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="bg-white text-black p-2 rounded-full hover:bg-opacity-80 transition-all duration-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectMovie(movie);
                                                            }}
                                                        >
                                                            <Play className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="bg-gray-800/80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-300"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title and info */}
                                            <div className="mt-2 px-1">
                                                <p className="text-sm font-medium text-white group-hover:text-red-500 transition-colors line-clamp-1">
                                                    {movie.title_geo || movie.title_eng}
                                                </p>
                                                {movie.title_geo && movie.title_eng && movie.title_geo !== movie.title_eng && (
                                                    <p className="text-xs text-gray-400 line-clamp-1">
                                                        {movie.title_eng}
                                                    </p>
                                                )}
                                                {movie.release_date && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {getReleaseYear(movie.release_date)}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        ) : resultCount === 0 && !isLoading && status.isError ? (
                            <div className="flex flex-col items-center justify-center h-full py-16">
                                <X size={48} className="text-gray-600 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">ფილმები ვერ მოიძებნა</h3>
                                <p className="text-gray-400 text-center max-w-md">
                                    სცადეთ სხვა საძიებო სიტყვა ან შეამოწმეთ ფილმების ბაზის ინდექსაცია.
                                </p>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieSearchModal;