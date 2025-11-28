import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        key: data.key,
        status: data.status,
      },
      include: {
        tasks: true,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
