'use client';

import React, { useState } from 'react';
import { Project } from '@/app/types';

interface ProjectFormProps {
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    key: '',
    status: 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.key) {
      onSubmit(formData);
      setFormData({ name: '', description: '', key: '', status: 'active' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold text-gray-900 text-sm">Nome do Projeto</label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Meu Projeto"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="key" className="font-semibold text-gray-900 text-sm">Chave do Projeto</label>
        <input
          id="key"
          type="text"
          placeholder="Ex: PROJ"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
          maxLength={5}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold text-gray-900 text-sm">Descrição</label>
        <textarea
          id="description"
          placeholder="Descrição do projeto..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="font-semibold text-gray-900 text-sm">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="px-3 py-2 border border-gray-300 rounded-md text-base text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="planning">Planejamento</option>
          <option value="active">Ativo</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">Criar Projeto</button>
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-md font-semibold hover:bg-gray-300 transition-colors">Cancelar</button>
      </div>
    </form>
  );
}
