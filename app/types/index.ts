export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectStatus = 'active' | 'archived' | 'planning';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string | null;
  dueDate?: Date | string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}
