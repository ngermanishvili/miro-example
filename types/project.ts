// მხარდაჭერილი ლოკალები
export type SupportedLocale = 'ka' | 'ru' | 'en';

// სართულის სურათი
export interface FloorImage {
    src: string;
    alt: string;
}

// სართული
export interface Floor {
    name: string;
    image: string;
    measurements: string[];
    floorImages?: FloorImage[]; // დამატებული ველი სართულის სურათებისთვის
}

// პროექტის სურათი
export interface ProjectImage {
    src: string;
    alt: string;
}

// პროექტის ენობრივი მონაცემები
export interface ProjectLanguageData {
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

// სრული პროექტის ინტერფეისი
export interface Project {
    id: string;
    ge: ProjectLanguageData;
    ru: ProjectLanguageData;
    en: ProjectLanguageData;
    [key: string]: ProjectLanguageData | string; // ინდექსირებული ტიპი ლოკალის დინამიურად გამოყენებისთვის
}

// MongoDB დოკუმენტი (შესაძლოა შეიცავდეს დამატებით ველებს)
export interface ProjectDocument {
    _id?: any;
    id: string;
    ge: ProjectLanguageData;
    ru: ProjectLanguageData;
    en: ProjectLanguageData;
}