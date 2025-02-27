import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// განვსაზღვროთ ტიპები ფილმებისთვის
interface Movie {
    id: string;
    title_eng: string;
    title_geo: string;
    release_date: string;
    imdb_vote: number;
    score: number;
    backdrop_path_tmdb: string;
    backdrop_poster_url: string;
}

// API-დან მიღებული შედეგის ტიპი
interface SearchResults {
    results: Movie[];
    count: number;
    query: string;
}

export default function Search() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchCount, setSearchCount] = useState<number>(0);

    // ძიების ფუნქცია
    const handleSearch = async (e?: FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!query.trim()) {
            setError('გთხოვთ შეიყვანოთ საძიებო ტექსტი');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8080/api/search?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`სერვერის შეცდომა: ${response.status}`);
            }

            const data: SearchResults = await response.json();
            console.log('API პასუხი:', data);

            if (data.results && Array.isArray(data.results)) {
                setResults(data.results);
                setSearchCount(data.count || data.results.length);
            } else if (data.results === undefined) {
                setResults([]);
                setSearchCount(0);
                setError('მონაცემების არასწორი ფორმატი');
            }
        } catch (err) {
            setError((err as Error).message || 'ძიებისას მოხდა შეცდომა');
            setResults([]);
            setSearchCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Enter ღილაკზე ძიება
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // ძიების ტექსტის შეცვლა
    const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    // ფილმის სურათის ლინკის ფორმირება
    const getImageUrl = (movie: Movie) => {
        if (movie.backdrop_path_tmdb) {
            return `https://image.tmdb.org/t/p/w300${movie.backdrop_path_tmdb}`;
        } else if (movie.backdrop_poster_url) {
            return movie.backdrop_poster_url;
        }
        return 'https://via.placeholder.com/300x450?text=ფოტო+არაა';
    };

    return (
        <div className="flex flex-col items-center p-4 w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">ფილმების ძიება</h1>

            {/* ძიების ფორმა */}
            <form onSubmit={handleSearch} className="w-full max-w-md mb-6 flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    placeholder="ჩაწერეთ ფილმის სახელი..."
                    className="p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                <button
                    type="submit"
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    disabled={loading}
                >
                    {loading ? 'ძიება...' : 'ძიება'}
                </button>
            </form>

            {/* შეცდომის მესიჯი */}
            {error && (
                <div className="w-full max-w-6xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* შედეგების რაოდენობა */}
            {searchCount > 0 && (
                <div className="w-full max-w-6xl mb-4">
                    <p className="text-sm text-gray-400">
                        ნაპოვნია {searchCount} შედეგი: "{query}"
                    </p>
                </div>
            )}

            {/* ჩატვირთვის ინდიკატორი */}
            {loading && (
                <div className="flex justify-center my-8">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* შედეგების რენდერი */}
            {!loading && results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {results.map((movie) => (
                        <div key={movie.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={getImageUrl(movie)}
                                    alt={movie.title_eng || movie.title_geo}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).onerror = null;
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                                    {movie.imdb_vote ? movie.imdb_vote.toFixed(1) : 'N/A'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-bold truncate" title={movie.title_eng || movie.title_geo}>
                                    {movie.title_eng || 'უცნობი სათაური'}
                                </h2>
                                <p className="text-sm text-gray-400 truncate" title={movie.title_geo}>
                                    {movie.title_geo || 'ქართული სათაური არ არის'}
                                </p>
                                <div className="mt-2 flex justify-between items-center text-sm text-gray-400">
                                    <span>{movie.release_date || 'თარიღი უცნობია'}</span>
                                    <span className="text-green-400">რელევანტურობა: {(movie.score * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !loading && query && !error ? (
                <div className="my-10 text-center text-gray-500">
                    <p className="text-xl">ფილმები ვერ მოიძებნა</p>
                    <p className="mt-2">სცადეთ სხვა საძიებო ფრაზა</p>
                </div>
            ) : null}
        </div>
    );
}