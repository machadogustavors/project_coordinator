import { prisma } from '@/app/lib/prisma';
import { ProjectsPage } from '@/app/components/ProjectsPage';
import { Project } from '@/app/types';

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <ProjectsPage initialProjects={projects as Project[]} />;
}
