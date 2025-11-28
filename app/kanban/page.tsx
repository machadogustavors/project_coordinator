import { prisma } from '@/app/lib/prisma';
import { KanbanPage } from '@/app/components/KanbanPage';
import { Project } from '@/app/types';

export default async function KanbanRoute() {
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <KanbanPage initialProjects={projects as Project[]} />;
}
