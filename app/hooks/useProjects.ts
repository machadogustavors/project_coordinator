import { useState, useCallback } from 'react';
import { Project, Task } from '@/app/types';

export function useProjects() {
  const [isLoading, setIsLoading] = useState(false);

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (projectId: string, taskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (projectId: string, taskId: string, updates: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (projectId: string, taskId: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
  };
}
