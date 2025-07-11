const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  dueDate: Date,
});

module.exports = mongoose.model("Task", TaskSchema);
