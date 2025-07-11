export interface User {
  id: string;
  email: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  project: string;
}

