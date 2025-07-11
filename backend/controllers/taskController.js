const Task = require("../models/Task");
const Project = require("../models/Project");

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getTasksByStatus = async (req, res) => {
  const { projectId, status } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    const tasks = await Task.find({ project: projectId, status });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.createTask = async (req, res) => {
  const { project, title, description, status, dueDate } = req.body;
  try {
    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ msg: "Project not found" });
    if (projectDoc.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    const task = new Task({ project, title, description, status, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    const project = await Project.findById(task.project);
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    const project = await Project.findById(task.project);
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};