const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

module.exports = mongoose.model("Project", ProjectSchema);
