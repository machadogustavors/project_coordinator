'use client';

import { useState, useMemo } from 'react';
import { Project, Task } from '@/app/types';
import { KanbanBoard } from './KanbanBoard';
import { Modal } from './Modal';
import { TaskForm } from './TaskForm';

interface KanbanPageProps {
  initialProjects: Project[];
}

interface TaskWithProject extends Task {
  projectName?: string;
  projectKey?: string;
}

export function KanbanPage({ initialProjects }: KanbanPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    new Set(projects.map(p => p.id))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const filteredTasks = useMemo(() => {
    return projects
      .filter(p => selectedProjectIds.has(p.id))
      .flatMap(p => 
        (p.tasks || []).map(task => ({
          ...task,
          projectName: p.name,
          projectKey: p.key,
        }))
      );
  }, [projects, selectedProjectIds]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      setIsLoading(true);
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const updatedProjects = projects.map(p => ({
        ...p,
        tasks: (p.tasks || []).map(t =>
          t.id === taskId ? { ...t, status } : t
        ),
      }));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });

      const updatedProjects = projects.map(p => ({
        ...p,
        tasks: (p.tasks || []).filter(t => t.id !== taskId),
      }));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProject = (projectId: string) => {
    const newSelected = new Set(selectedProjectIds);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjectIds(newSelected);
  };

  const toggleAllProjects = () => {
    if (selectedProjectIds.size === projects.length) {
      setSelectedProjectIds(new Set());
    } else {
      setSelectedProjectIds(new Set(projects.map(p => p.id)));
    }
  };

  const handleCreateTask = async (data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> & { projectId?: string }) => {
    const projectId = data.projectId;
    if (!projectId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assignee: data.assignee,
          dueDate: data.dueDate,
        }),
      });
      const newTask = await response.json();

      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <Modal
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        title="Nova Tarefa"
      >
        <TaskForm
          projects={projects}
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      </Modal>

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Quadro Kanban</h2>
          <p className="text-gray-600 mt-1">Visualize todas as tarefas em um único lugar</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtrar por Projeto</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTaskForm(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                + Nova Tarefa
              </button>
              <button
                onClick={toggleAllProjects}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-2"
              >
                {selectedProjectIds.size === projects.length ? 'Desselecionar Tudo' : 'Selecionar Tudo'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {projects.map(project => (
              <label key={project.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProjectIds.has(project.id)}
                  onChange={() => toggleProject(project.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  {project.name} <span className="text-gray-500">({project.key})</span>
                </span>
              </label>
            ))}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''} selecionada{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>


        {filteredTasks.length > 0 ? (
          <KanbanBoard
            tasks={filteredTasks as Task[]}
            onStatusChange={handleStatusChange}
            onEdit={() => {}}
            onDelete={handleDeleteTask}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600">Nenhuma tarefa encontrada nos projetos selecionados.</p>
          </div>
        )}
      </main>
    </div>
  );
}
