'use client';

import React from 'react';
import { Task } from '@/app/types';

interface TaskCardProps {
  task: Task & { projectName?: string; projectKey?: string };
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('taskData', JSON.stringify(task));
  };
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    critical: 'Crítica',
  };

  const statusLabels = {
    todo: 'A Fazer',
    'in-progress': 'Em Progresso',
    done: 'Concluído',
    blocked: 'Bloqueado',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-move hover:border-blue-400"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {task.projectKey && (
            <p className="text-xs text-gray-500 font-semibold mb-1">
              {task.projectKey} - {task.projectName}
            </p>
          )}
          <h4 className="font-semibold text-gray-900">{task.title}</h4>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold ml-2"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityColors[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer ${statusColors[task.status]}`}
        >
          <option value="todo">A Fazer</option>
          <option value="in-progress">Em Progresso</option>
          <option value="done">Concluído</option>
          <option value="blocked">Bloqueado</option>
        </select>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <div className="flex gap-4">
          {task.assignee && <span>👤 {task.assignee}</span>}
          {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>}
        </div>
        <button
          onClick={() => onEdit(task)}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
