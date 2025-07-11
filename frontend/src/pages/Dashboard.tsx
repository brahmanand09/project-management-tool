import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';

const projectSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['active', 'completed']).required('Status is required'),
}).required();

const taskSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['todo', 'in-progress', 'done']).required('Status is required'),
  dueDate: yup.string().required('Due date is required'),
}).required();

type ProjectFormData = yup.InferType<typeof projectSchema>;
type TaskFormData = yup.InferType<typeof taskSchema>;

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const perPage = 4;

  const { logout } = useAuth();

  const { register: registerProject, handleSubmit: handleProjectSubmit, reset: resetProject, formState: { errors: projectErrors } } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: { title: '', description: '', status: 'active' },
  });

  const { register: registerTask, handleSubmit: handleTaskSubmit, reset: resetTask, formState: { errors: taskErrors } } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: { title: '', description: '', status: 'todo', dueDate: '' },
  });

  useEffect(() => {
    fetchProjects();
  }, [projectPage, searchQuery]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`/projects?page=${projectPage}&limit=${perPage}&search=${searchQuery}`);
      setProjects(res.data.projects);
      setTotalProjects(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTasks = async (projectId: string, status?: string) => {
    setSelectedProjectId(projectId);
    try {
      let url = `/tasks/project/${projectId}`;
      if (status) url += `/status/${status}`;
      const res = await axios.get(url);
      setTasks(res.data);
      setFilterStatus(status || null);
      setTaskPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const onProjectSubmit = async (data: ProjectFormData) => {
    try {
      if (editingId) {
        await axios.put(`/projects/${editingId}`, data);
      } else {
        await axios.post('/projects', data);
      }
      resetProject({ title: '', description: '', status: 'active' });
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectEdit = (project: Project) => {
    resetProject(project);
    setEditingId(project._id || null);
  };

  const handleProjectDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      try {
        await axios.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onTaskSubmit = async (data: TaskFormData) => {
    try {
      const payload = { ...data, project: selectedProjectId! };
      if (editingTaskId) {
        await axios.put(`/tasks/${editingTaskId}`, payload);
      } else {
        await axios.post('/tasks', payload);
      }
      resetTask({ title: '', description: '', status: 'todo', dueDate: '' });
      setEditingTaskId(null);
      loadTasks(selectedProjectId!);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskEdit = (task: Task) => {
    resetTask(task);
    setEditingTaskId(task._id || null);
  };

  const handleTaskDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      try {
        await axios.delete(`/tasks/${id}`);
        loadTasks(selectedProjectId!);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(taskSearchQuery.toLowerCase())
  );
  const paginatedTasks = filteredTasks.slice((taskPage - 1) * perPage, taskPage * perPage);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? 'Edit Project' : 'Add Project'}</h2>
          <form onSubmit={handleProjectSubmit(onProjectSubmit)} className="space-y-4">
            <div>
              <label htmlFor="project-title" className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                id="project-title"
                {...registerProject('title')}
                placeholder="Enter project title"
                className="input mt-1"
              />
              {projectErrors.title && <p className="error">{projectErrors.title.message}</p>}
            </div>
            <div>
              <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="project-description"
                {...registerProject('description')}
                placeholder="Enter project description"
                className="input mt-1 min-h-[100px]"
              />
              {projectErrors.description && <p className="error">{projectErrors.description.message}</p>}
            </div>
            <div>
              <label htmlFor="project-status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="project-status"
                {...registerProject('status')}
                className="input mt-1"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              {projectErrors.status && <p className="error">{projectErrors.status.message}</p>}
            </div>
            <button type="submit" className="btn w-full">
              {editingId ? 'Update Project' : 'Create Project'}
            </button>
          </form>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Projects</h2>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setProjectPage(1);
              }}
              className="input mb-4"
            />
            {projects.length === 0 && <p className="text-gray-600">No projects found.</p>}
            {projects.map((p) => (
              <div
                key={p._id}
                className="p-4 border border-gray-200 rounded-md mb-3 bg-gray-50 hover:bg-gray-100 transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <div onClick={() => loadTasks(p._id!)} className="cursor-pointer">
                    <strong className="text-gray-800">{p.title}</strong>
                    <span className="text-sm text-gray-600 italic ml-2">({p.status})</span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleProjectEdit(p)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleProjectDelete(p._id!)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              </div>
            ))}
            {totalProjects > perPage && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="btn text-sm"
                    disabled={projectPage === 1}
                    onClick={() => setProjectPage(p => p - 1)}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.ceil(totalProjects / perPage) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setProjectPage(i + 1)}
                      className={`btn text-sm ${projectPage === i + 1 ? 'bg-blue-700' : 'bg-blue-500'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="btn text-sm"
                    disabled={(projectPage * perPage) >= totalProjects}
                    onClick={() => setProjectPage(p => p + 1)}
                  >
                    Next →
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Page {projectPage} of {Math.ceil(totalProjects / perPage)}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Tasks</h2>
          {!selectedProjectId && <p className="text-gray-600">Select a project to view tasks.</p>}
          {selectedProjectId && (
            <>
              <div className="mb-4 flex gap-2 flex-wrap">
                {['all', 'todo', 'in-progress', 'done'].map((s) => (
                  <button
                    key={s}
                    onClick={() => loadTasks(selectedProjectId!, s === 'all' ? undefined : s)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${filterStatus === s || (s === 'all' && !filterStatus) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={taskSearchQuery}
                onChange={(e) => {
                  setTaskSearchQuery(e.target.value);
                  setTaskPage(1);
                }}
                className="input mb-4"
              />
              <form onSubmit={handleTaskSubmit(onTaskSubmit)} className="space-y-4 mb-6">
                <h3 className="text-md font-semibold text-gray-800">{editingTaskId ? 'Edit Task' : 'Add Task'}</h3>
                <div>
                  <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    id="task-title"
                    {...registerTask('title')}
                    placeholder="Enter task title"
                    className="input mt-1"
                  />
                  {taskErrors.title && <p className="error">{taskErrors.title.message}</p>}
                </div>
                <div>
                  <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="task-description"
                    {...registerTask('description')}
                    placeholder="Enter task description"
                    className="input mt-1 min-h-[100px]"
                  />
                  {taskErrors.description && <p className="error">{taskErrors.description.message}</p>}
                </div>
                <div>
                  <label htmlFor="task-dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    id="task-dueDate"
                    type="date"
                    {...registerTask('dueDate')}
                    className="input mt-1"
                  />
                  {taskErrors.dueDate && <p className="error">{taskErrors.dueDate.message}</p>}
                </div>
                <div>
                  <label htmlFor="task-status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="task-status"
                    {...registerTask('status')}
                    className="input mt-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  {taskErrors.status && <p className="error">{taskErrors.status.message}</p>}
                </div>
                <button type="submit" className="btn w-full bg-green-600 hover:bg-green-700">
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </form>
              {paginatedTasks.length === 0 && <p className="text-gray-600">No tasks found.</p>}
              {paginatedTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-4 border border-gray-200 rounded-md mb-3 bg-white shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-gray-800">{t.title}</strong>
                      <span className="text-sm text-gray-600 italic ml-2">({t.status.replace('-', ' ')})</span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleTaskEdit(t)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTaskDelete(t._id!)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
              {filteredTasks.length > perPage && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="btn text-sm"
                      disabled={taskPage === 1}
                      onClick={() => setTaskPage(p => p - 1)}
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.ceil(filteredTasks.length / perPage) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setTaskPage(i + 1)}
                        className={`btn text-sm ${taskPage === i + 1 ? 'bg-blue-700' : 'bg-blue-500'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="btn text-sm"
                      disabled={(taskPage * perPage) >= filteredTasks.length}
                      onClick={() => setTaskPage(p => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Page {taskPage} of {Math.ceil(filteredTasks.length / perPage)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}