// services/projectService.ts
import { Project, SupportedLocale, ProjectDocument } from '@/types/project';
import clientPromise from '@/lib/mongodb';

export async function getAllProjects(): Promise<Project[]> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const projectsCollection = db.collection<ProjectDocument>('projects');

    const projects = await projectsCollection.find({}).toArray();

    // MongoDB-დან მიღებული მონაცემები უკვე სწორი ტიპის იქნება
    return projects as unknown as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const projectsCollection = db.collection<ProjectDocument>('projects');

    const project = await projectsCollection.findOne({ id });

    if (!project) return null;

    // MongoDB-დან მიღებული მონაცემები უკვე სწორი ტიპის იქნება
    return project as unknown as Project;
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const projectsCollection = db.collection<ProjectDocument>('projects');

    const projects = await projectsCollection.find({ id: { $in: ids } }).toArray();

    // MongoDB-დან მიღებული მონაცემები უკვე სწორი ტიპის იქნება
    return projects as unknown as Project[];
}

// ლოკალეს გარდაქმნის ფუნქცია
export function mapLocale(locale: SupportedLocale): keyof Project {
    switch (locale) {
        case 'ka':
            return 'ge';
        case 'ru':
            return 'ru';
        case 'en':
            return 'en';
        default:
            return 'ge'; // ნაგულისხმევად ქართული
    }
}

// ტიპიზაციის დამხმარე ფუნქცია
export function isProjectLanguageData(data: any): boolean {
    return data && typeof data === 'object' && typeof data.title === 'string';
}