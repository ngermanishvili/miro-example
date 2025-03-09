import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/services/projectService';
import clientPromise from '@/lib/mongodb';
import { Project } from '@/types/project';

interface Params {
    id: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const project = await getProjectById(id);

        if (!project) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'პროექტის ჩატვირთვა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const projectData: Project = await request.json();

        // შევამოწმოთ, რომ პროექტის ID არ შეცვლილა
        if (projectData.id !== id) {
            return NextResponse.json(
                { error: 'პროექტის ID-ის შეცვლა დაუშვებელია' },
                { status: 400 }
            );
        }

        // მოვიპოვოთ არსებული პროექტი, რომ დავრწმუნდეთ რომ არსებობს
        const existingProject = await getProjectById(id);
        if (!existingProject) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        // Remove _id field from the project data to avoid MongoDB error
        const { _id, ...projectWithoutId } = projectData as any;

        // განვაახლოთ პროექტი MongoDB-ში
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const projectsCollection = db.collection('projects');

        const updateResult = await projectsCollection.updateOne(
            { id },
            { $set: projectWithoutId }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'პროექტი წარმატებით განახლდა'
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'პროექტის განახლება ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        // მოვიპოვოთ არსებული პროექტი, რომ დავრწმუნდეთ რომ არსებობს
        const existingProject = await getProjectById(id);
        if (!existingProject) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        // წავშალოთ პროექტი MongoDB-დან
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const projectsCollection = db.collection('projects');

        const deleteResult = await projectsCollection.deleteOne({ id });

        if (deleteResult.deletedCount === 0) {
            return NextResponse.json(
                { error: 'პროექტი ვერ მოიძებნა' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'პროექტი წარმატებით წაიშალა'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'პროექტის წაშლა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}