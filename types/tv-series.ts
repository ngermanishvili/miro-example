// types/tv-series.ts

// ჟანრების ინტერფეისი
export interface Genre {
    id: number;
    name: string;
}

// მსახიობების ინტერფეისი
export interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
    character_name: string;
    order: number;
    updated_at?: string;
    created_at?: string;
}

// პროდიუსერი კომპანიების ინტერფეისი
export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country?: string;
    tmdb_details?: unknown;
}

// ეპიზოდების ინტერფეისი
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

// მთავარი TV Series ინტერფეისი
export interface TVSeries {
    id: number;
    tmdb_id: number | null;
    imdb_url: string | null;
    title_geo: string;
    title_eng: string;
    imdb_vote: string | null;
    duration: string | null;
    description: string | null;
    description_eng?: string | null;
    description_geo?: string | null;
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
    genres: Genre[];
    production_companies: ProductionCompany[];
    cast_members: CastMember[];
}

// API Response ინტერფეისი
export interface TVSeriesApiResponse {
    status: 'success' | 'error';
    data?: {
        series: TVSeries[];
        pagination: {
            currentPage: number;
            itemsPerPage: number;
            totalItems: number;
            totalPages: number;
            hasMore: boolean;
        };
    };
    error?: {
        message: string;
        details?: string;
    };
}

// Page Props ინტერფეისი
export interface TVSeriesPageProps {
    initialData?: TVSeriesApiResponse;
}

// სერჩ პარამეტრების ინტერფეისი
export interface TVSeriesSearchParams {
    page?: number;
    limit?: number;
    companies?: string;
    platform?: string;
}