"use client"

// Modified MovieSearch component as a modal
import { useState, useRef, useEffect } from 'react';
import { Movie } from '@/types/search';
import { Star, Search as SearchIcon, X } from 'lucide-react';
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
    const searchInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Focus input when modal opens
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        // Close modal on ESC key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Close modal if clicked outside
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const showStatus = (message: string, isError: boolean = false) => {
        setStatus({ message, isError });
    };

    // Get image path with proper fallback handling
    const getImagePath = (movie: Movie) => {
        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w300${movie.backdrop_path_tmdb}`;
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
            } else {
                showStatus(`არ მოიძებნა შედეგი: "${data.query}"`, true);
                setResults([]);
                setResultCount(0);
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
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-start justify-center pt-16 overflow-y-auto"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="w-full max-w-4xl mx-auto p-6 rounded-lg"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            aria-label="Close search"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">ფილმის ძიება</h2>

                        {/* Search input */}
                        <div className="flex gap-3 mb-5">
                            <div className="relative flex-grow">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyUp={handleKeyPress}
                                    placeholder="ფილმის ძიება ქართულად ან ინგლისურად..."
                                    className="w-full p-3 pl-10 border border-gray-700 bg-gray-900 rounded-md text-base text-white placeholder-gray-400"
                                />
                                <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                            </div>
                            <button
                                onClick={performSearch}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors ${isLoading ? 'bg-gray-600 cursor-not-allowed' : ''
                                    }`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'ძიება...' : 'ძიება'}
                            </button>
                        </div>

                        {/* Status message */}
                        <div
                            className={`p-4 mb-5 rounded-md ${status.isError
                                    ? 'bg-red-900/30 border-l-4 border-red-600 text-red-200'
                                    : 'bg-gray-800/50 border-l-4 border-gray-600 text-gray-300'
                                }`}
                        >
                            {status.message}
                        </div>

                        {/* Results */}
                        {results.length > 0 ? (
                            <div className="mt-5">
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ staggerChildren: 0.1 }}
                                >
                                    {results.map((movie) => (
                                        <motion.div
                                            key={movie.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="cursor-pointer transition-transform"
                                            onClick={() => handleSelectMovie(movie)}
                                        >
                                            <div className="relative h-40 rounded-md overflow-hidden shadow-lg">
                                                <Image
                                                    src={getImagePath(movie)}
                                                    alt={movie.title_eng || movie.title_geo}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                    className="object-cover rounded-md"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = FALLBACK_IMAGE;
                                                    }}
                                                    unoptimized={!getImagePath(movie).startsWith('https://image.tmdb.org')}
                                                />

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                                {/* IMDB rating */}
                                                {movie.imdb_vote && (
                                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm">
                                                        <Star className="w-3 h-3 text-yellow-400" />
                                                        <span className="text-xs text-white">
                                                            {typeof movie.imdb_vote === 'number'
                                                                ? movie.imdb_vote.toFixed(1)
                                                                : parseFloat(String(movie.imdb_vote)).toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <span className="text-white bg-blue-600 px-4 py-2 rounded-md">
                                                        დეტალები
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title and info */}
                                            <div className="mt-2 px-1">
                                                <p className="text-sm font-medium text-gray-200 line-clamp-1">
                                                    {movie.title_geo || movie.title_eng}
                                                </p>
                                                {movie.title_geo && movie.title_eng && movie.title_geo !== movie.title_eng && (
                                                    <p className="text-xs text-gray-400 line-clamp-1">
                                                        {movie.title_eng}
                                                    </p>
                                                )}
                                                {movie.release_date && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {getReleaseYear(movie.release_date)}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        ) : resultCount === 0 && !isLoading && status.isError ? (
                            <div className="text-center py-8">
                                <h3 className="text-xl font-semibold text-white">ფილმები ვერ მოიძებნა</h3>
                                <p className="text-gray-400">სცადეთ სხვა საძიებო სიტყვა ან შეამოწმეთ ფილმების ბაზის ინდექსაცია.</p>
                            </div>
                        ) : null}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};