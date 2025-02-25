// types/index.ts

export interface TVShow {
    id: number;
    title_eng: string;
    title_geo: string;
    imdb_vote: string | null;
    backdrop_poster_url: string | null;
    backdrop_path_tmdb: string | null;
    release_date: string | null;
    poster_logo: { logo_path: string } | null;
    homepage_url?: string;
}

export interface TVShowsApiResponse {
    series: TVShow[];
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface StreamingService {
    id: string;
    name: string;
    platform: string;
    logo: string;
    colorClass: string;
}

export interface StreamingSectionProps {
    companyId: string;
    platform: string;
    serviceName: string;
}

// კონსტანტები
export const FALLBACK_IMAGE = '/placeholder.svg';
export const SHOWS_PER_SECTION = 8;

export const STREAMING_SERVICES: StreamingService[] = [
    {
        id: "149",
        name: "Netflix",
        platform: "netflix",
        logo: "/assets/production-companies/netflix.png",
        colorClass: "bg-gradient-to-r from-netflix-red to-netflix-darkred"
    },
    {
        id: "2",
        name: "Disney",
        platform: "disneyplus",
        logo: "/assets/production-companies/disney.png",
        colorClass: "bg-gradient-to-r from-disney-blue to-disney-darkblue"
    },
    {
        id: "1342",
        name: "HBO",
        platform: "hbo",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-hbo-teal to-hbo-darkteal"
    },
    {
        id: "688",
        name: "Paramount",
        platform: "paramountplus",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-paramount-blue to-paramount-darkblue"
    },
    {
        id: "883",
        name: "Amazon",
        platform: "amazon",
        logo: "/assets/production-companies/amazon.png",
        colorClass: "bg-gradient-to-r from-amazon-teal to-amazon-darkteal"
    }
];