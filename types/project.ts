// types/project.ts
export interface Project {
    id: string;
    title: string;
    shortDescription: string;
    location: string;
    function: string;
    area: string;
    year: string;
    description: string[];
    floors: Floor[];
    images: Image[];
    thumbnail: string;
}

export interface Floor {
    name: string;
    image: string;
    measurements: string[];
}

export interface Image {
    src: string;
    alt: string;
}