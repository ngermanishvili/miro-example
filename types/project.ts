export interface Floor {
    name: string;
    image: string;
    measurements: string[];
}

export interface ProjectImage {
    src: string;
    alt: string;
}

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
    images: ProjectImage[];
    thumbnail: string;
}