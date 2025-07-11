const Project = require("../models/Project");

exports.getProjects = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = { user: req.user.id };
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  try {
    const projects = await Project.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Project.countDocuments(query);
    res.json({ projects, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.createProject = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const project = new Project({ user: req.user.id, title, description, status });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.user.toString() !== req.user.id) return res.status(403).json({ msg: "Unauthorized" });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};