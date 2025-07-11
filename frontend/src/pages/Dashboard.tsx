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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={logout} className="btn bg-red-600 hover:bg-red-700">Logout</button>
      </div>

      <form onSubmit={handleProjectSubmit(onProjectSubmit)} className="bg-white rounded shadow p-4 mb-6 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit' : 'Add'} Project</h2>
        <div>
          <input {...registerProject('title')} placeholder="Title" className="input" />
          <p className="text-red-600 text-sm">{projectErrors.title?.message}</p>
        </div>
        <div>
          <input {...registerProject('description')} placeholder="Description" className="input" />
          <p className="text-red-600 text-sm">{projectErrors.description?.message}</p>
        </div>
        <div>
          <select {...registerProject('status')} className="input">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <p className="text-red-600 text-sm">{projectErrors.status?.message}</p>
        </div>
        <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white">{editingId ? 'Update' : 'Create'} Project</button>
      </form>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-lg mb-2">Projects</h2>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setProjectPage(1);
            }}
            className="input mb-3"
          />

          {projects.map((p) => (
            <div key={p._id} className="p-3 border rounded mb-3 shadow-sm bg-gray-50 hover:bg-gray-100">
              <div className="flex justify-between items-center">
                <div onClick={() => loadTasks(p._id!)} className="cursor-pointer">
                  <strong>{p.title}</strong> <span className="text-sm text-gray-600 italic">({p.status})</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleProjectEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleProjectDelete(p._id!)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <p className="text-sm mt-1">{p.description}</p>
            </div>
          ))}

          {totalProjects > perPage && (
            <div className="flex flex-col items-center gap-1 mt-3">
              <div className="flex gap-2 flex-wrap">
                <button className="btn text-sm" disabled={projectPage === 1} onClick={() => setProjectPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: Math.ceil(totalProjects / perPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setProjectPage(i + 1)}
                    className={`btn text-sm ${projectPage === i + 1 ? 'bg-blue-700' : 'bg-blue-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="btn text-sm" disabled={(projectPage * perPage) >= totalProjects} onClick={() => setProjectPage(p => p + 1)}>Next →</button>
              </div>
              <div className="text-xs text-gray-600">Page {projectPage} of {Math.ceil(totalProjects / perPage)}</div>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">Tasks</h2>
          <div className="mb-3 flex gap-2 text-sm">
            {['all', 'todo', 'in-progress', 'done'].map((s) => (
              <button
                key={s}
                onClick={() => loadTasks(selectedProjectId!, s === 'all' ? undefined : s)}
                className={`px-3 py-1 rounded ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                disabled={!selectedProjectId}
              >{s}</button>
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
            className="input mb-3"
          />
          {selectedProjectId && (
            <form onSubmit={handleTaskSubmit(onTaskSubmit)} className="bg-white rounded shadow p-4 mb-4 space-y-3">
              <h3 className="font-semibold">{editingTaskId ? 'Edit' : 'Add'} Task</h3>
              <div>
                <input {...registerTask('title')} placeholder="Title" className="input" />
                <p className="text-red-600 text-sm">{taskErrors.title?.message}</p>
              </div>
              <div>
                <input {...registerTask('description')} placeholder="Description" className="input" />
                <p className="text-red-600 text-sm">{taskErrors.description?.message}</p>
              </div>
              <div>
                <input type="date" {...registerTask('dueDate')} className="input" />
                <p className="text-red-600 text-sm">{taskErrors.dueDate?.message}</p>
              </div>
              <div>
                <select {...registerTask('status')} className="input">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <p className="text-red-600 text-sm">{taskErrors.status?.message}</p>
              </div>
              <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white">{editingTaskId ? 'Update' : 'Add'} Task</button>
            </form>
          )}
          {paginatedTasks.map((t) => (
            <div key={t._id} className="p-3 border rounded mb-2 bg-white shadow-sm">
              <strong>{t.title}</strong> <span className="text-sm italic text-gray-600">({t.status})</span>
              <p className="text-sm text-gray-700">{t.description}</p>
              <p className="text-xs text-gray-400">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
              <div className="mt-1 space-x-3 text-sm">
                <button onClick={() => handleTaskEdit(t)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleTaskDelete(t._id!)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {filteredTasks.length > perPage && (
            <div className="flex flex-col items-center gap-1 mt-3">
              <div className="flex gap-2 flex-wrap">
                <button className="btn text-sm" disabled={taskPage === 1} onClick={() => setTaskPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: Math.ceil(filteredTasks.length / perPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setTaskPage(i + 1)}
                    className={`btn text-sm ${taskPage === i + 1 ? 'bg-blue-700' : 'bg-blue-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="btn text-sm" disabled={(taskPage * perPage) >= filteredTasks.length} onClick={() => setTaskPage(p => p + 1)}>Next →</button>
              </div>
              <div className="text-xs text-gray-600">Page {taskPage} of {Math.ceil(filteredTasks.length / perPage)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}