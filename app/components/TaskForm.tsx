'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Project } from '@/app/types';

interface TaskFormProps {
  projectKey?: string;
  projects?: Project[];
  onSubmit: (data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> & { projectId?: string }) => void;
  onCancel: () => void;
}

export function TaskForm({ projectKey, projects, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignee: '',
    dueDate: '',
    projectId: projects && projects.length > 0 ? projects[0].id : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        projectId: projects && projects.length > 0 ? projects[0].id : '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {projects && projects.length > 1 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="projectId" className="font-semibold text-gray-900 text-sm">Projeto</label>
          <select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.key})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-semibold text-gray-900 text-sm">Título</label>
        <input
          id="title"
          type="text"
          placeholder="Descrição da tarefa"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold text-gray-900 text-sm">Descrição</label>
        <textarea
          id="description"
          placeholder="Detalhes da tarefa..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="priority" className="font-semibold text-gray-900 text-sm">Prioridade</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="font-semibold text-gray-900 text-sm">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="todo">A Fazer</option>
            <option value="in-progress">Em Progresso</option>
            <option value="done">Concluído</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="assignee" className="font-semibold text-gray-900 text-sm">Responsável</label>
          <input
            id="assignee"
            type="text"
            placeholder="Nome ou email"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="dueDate" className="font-semibold text-gray-900 text-sm">Data de Conclusão</label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors">Criar Tarefa</button>
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-md font-semibold hover:bg-gray-300 transition-colors">Cancelar</button>
      </div>
    </form>
  );
}
