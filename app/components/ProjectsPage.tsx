'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProjectForm } from '@/app/components/ProjectForm';
import { ProjectCard } from '@/app/components/ProjectCard';
import { TaskForm } from '@/app/components/TaskForm';
import { KanbanBoard } from '@/app/components/KanbanBoard';
import { Modal } from '@/app/components/Modal';
import { Project, Task } from '@/app/types';

interface ProjectsPageProps {
  initialProjects: Project[];
}

export function ProjectsPage({ initialProjects }: ProjectsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projectId, projects]);

  useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  }, [projects]);

  const handleCreateProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setShowProjectForm(false);
      router.push(`?projectId=${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedProject) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${selectedProject.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newTask = await response.json();

      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            tasks: [...(p.tasks || []), newTask],
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    if (!selectedProject) return;

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            tasks: (p.tasks || []).map(t =>
              t.id === taskId ? { ...t, status } : t
            ),
          };
        }
        return p;
      });
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedProject) return;

    try {
      setIsLoading(true);
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });

      const updatedProjects = projects.map(p => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            tasks: (p.tasks || []).filter(t => t.id !== taskId),
          };
        }
        return p;
      });
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Meus Projetos</h2>
            <p className="text-gray-600 mt-1">Gerencie e acompanhe seus projetos</p>
          </div>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            + Novo Projeto
          </button>
        </div>

        <Modal
          isOpen={showProjectForm}
          onClose={() => setShowProjectForm(false)}
          title="Novo Projeto"
        >
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setShowProjectForm(false)}
          />
        </Modal>


        {selectedProject && (
          <Modal
            isOpen={showTaskForm}
            onClose={() => setShowTaskForm(false)}
            title={`Nova Tarefa - ${selectedProject.key}`}
          >
            <TaskForm
              projectKey={selectedProject.key}
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
            />
          </Modal>
        )}


        {!selectedProject && (
          <div>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum projeto criado ainda.</p>
                <p className="text-gray-500">Crie o seu primeiro projeto para começar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={() => {
                      setSelectedProject(project);
                      router.push(`?projectId=${project.id}`);
                    }}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>
        )}


        {selectedProject && (
          <div>

            <div className="mb-8">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  router.push('/');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
              >
                ← Voltar para Projetos
              </button>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedProject.name}</h2>
                    <p className="text-gray-600 mt-2">{selectedProject.description}</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-400">{selectedProject.key}</span>
                </div>
              </div>
            </div>


            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Tarefas</h3>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {showTaskForm ? 'Cancelar' : '+ Nova Tarefa'}
                </button>
              </div>

              {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                <KanbanBoard
                  tasks={selectedProject.tasks}
                  onStatusChange={handleStatusChange}
                  onEdit={() => {}}
                  onDelete={handleDeleteTask}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-600">Nenhuma tarefa criada ainda.</p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Criar Primeira Tarefa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
