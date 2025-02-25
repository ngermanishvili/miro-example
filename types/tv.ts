// types/tv.ts

export interface Episode {
    id: number;
    title: string;
    season: number;
    episode: number;
    runtime: number;
    air_date: string;
    overview: string;
    video_url: string;
    poster_url: string;
    vote_count: number;
    is_available: boolean;
    vote_average: number;
}

export interface TVShow {
    id: number;
    tmdb_id: number | null;
    imdb_url: string | null;
    title_geo: string;
    title_eng: string;
    imdb_vote: string | null;
    duration: string | null;
    description: string | null;
    requested: number | null;
    created_at: string | null;
    backdrop_path_tmdb: string | null;
    poster_path_tmdb: string | null;
    backdrop_poster_url: string | null;
    poster_url: string | null;
    cdn_url: string | null;
    content_type: string | null;
    homepage: string | null;
    seasons: number | null;
    episode_count: number | null;
    episodes: Episode[] | null;
    release_date: string | null;
    available_episodes: number | null;
    total_seasons: number | null;
    available_seasons_list: number[] | null;
    poster_logo: {
        logo_path: string;
        last_updated?: string;
    } | null;
    genres: Array<{
        id: number;
        name: string;
    }>;
    production_companies: Array<{
        id: number;
        name: string;
        logo_path: string;
        origin_country?: string;
        tmdb_details?: unknown;
    }>;
    cast_members: Array<{
        id: number;
        name: string;
        profile_path: string;
        character_name: string;
        order: number;
        updated_at?: string;
        created_at?: string;
    }>;
}

export interface TVShowsApiResponse {
    series: TVShow[];
    page: number;
    limit: number;
    hasMore: boolean;
}

export type ContentType = 'movies' | 'tvshows';
