require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany();
  await Project.deleteMany();
  await Task.deleteMany();

  const hashed = await bcrypt.hash("Test@123", 10);
  const user = await User.create({ email: "test@example.com", password: hashed });

  for (let i = 1; i <= 2; i++) {
    const project = await Project.create({
      user: user._id,
      title: `Project ${i}`,
      description: `Description for project ${i}`,
    });

    for (let j = 1; j <= 3; j++) {
      await Task.create({
        project: project._id,
        title: `Task ${j} for Project ${i}`,
        description: `Task details`,
        dueDate: new Date(),
      });
    }
  }

  console.log("Seeded successfully");
  process.exit();
});
