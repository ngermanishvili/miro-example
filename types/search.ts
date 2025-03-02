// types/search.ts
export interface Movie {
    id: number;
    title_geo: string;
    title_eng: string;
    release_date?: string;
    imdb_vote?: number;
    backdrop_poster_url?: string;
    backdrop_path_tmdb?: string;
}

export interface SearchResponse {
    success: boolean;
    query: string;
    count: number;
    results: Movie[];
    error?: string;
}

export interface TestResponse {
    success: boolean;
    message: string;
    timestamp: string;
    version: string;
}

export interface IndexResponse {
    success: boolean;
    message: string;
    count?: number;
    error?: string;
}

export interface ListMoviesResponse {
    success: boolean;
    count: number;
    movies: Movie[];
    error?: string;
}