'use client';

import React, { useState } from 'react';
import { Task } from '@/app/types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete }: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<Task['status'] | null>(null);

  const columns: { id: Task['status']; title: string }[] = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'in-progress', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' },
    { id: 'blocked', title: 'Bloqueado' },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: Task['status']) => {
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (status: Task['status'], e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(column.id, e)}
          className={`bg-gray-100 rounded-lg p-4 min-h-96 transition-colors ${
            dragOverColumn === column.id ? 'bg-blue-50 border-2 border-blue-400' : ''
          }`}
        >
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
            <p className="text-sm text-gray-600">{getTasksByStatus(column.id).length} tarefas</p>
          </div>

          <div className="flex flex-col gap-3">
            {getTasksByStatus(column.id).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
