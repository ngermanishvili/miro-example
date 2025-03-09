// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectById } from '@/services/projectService';
import clientPromise from '@/lib/mongodb';
import { Project } from '@/types/project';

export async function GET() {
    try {
        const projects = await getAllProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'პროექტების ჩატვირთვა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const projectData: Project = await request.json();

        // შევამოწმოთ რომ პროექტს აქვს ID
        if (!projectData.id || projectData.id.trim() === '') {
            return NextResponse.json(
                { error: 'პროექტის ID ცარიელია' },
                { status: 400 }
            );
        }

        // შევამოწმოთ რომ პროექტი ამ ID-ით არ არსებობს
        const existingProject = await getProjectById(projectData.id);
        if (existingProject) {
            return NextResponse.json(
                { error: `პროექტი ID-ით "${projectData.id}" უკვე არსებობს` },
                { status: 409 } // Conflict
            );
        }

        // დავამატოთ პროექტი MongoDB-ში
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const projectsCollection = db.collection('projects');

        const result = await projectsCollection.insertOne(projectData);

        if (!result.acknowledged) {
            throw new Error('მონაცემთა ბაზაში ჩაწერა ვერ მოხერხდა');
        }

        return NextResponse.json({
            success: true,
            message: 'პროექტი წარმატებით შეიქმნა',
            id: projectData.id
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'პროექტის შექმნა ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}