// types/tv-series.ts

export interface Genre {
    id: number;
    name: string;
}

export interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
    character_name: string;
    order?: number;
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
}

export interface TVShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    status: string;
    genres: Genre[];
    cast_members: CastMember[];
    production_companies: ProductionCompany[];
    number_of_seasons?: number;
    number_of_episodes?: number;
    in_production?: boolean;
    tagline?: string;
}

export interface TVSeriesApiResponse {
    series: TVShow[];
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface TVSeriesPageProps {
    initialData?: TVSeriesApiResponse;
}