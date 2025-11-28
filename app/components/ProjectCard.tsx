import React from 'react';
import { Project } from '@/app/types';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onSelect, onDelete }: ProjectCardProps) {
  const taskCount = project.tasks?.length || 0;
  const completedCount = project.tasks?.filter(t => t.status === 'done').length || 0;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    planning: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1" onClick={onSelect}>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="text-red-500 hover:text-red-700 font-semibold text-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[project.status]}`}>
          {project.status === 'active' ? 'Ativo' : project.status === 'planning' ? 'Planejamento' : 'Arquivado'}
        </span>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-gray-900">{taskCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Concluídas:</span>
            <span className="font-bold text-green-600">{completedCount}</span>
          </div>
        </div>
      </div>

      {taskCount > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(completedCount / taskCount) * 100}%` }}
          />
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
      </p>
    </div>
  );
}
