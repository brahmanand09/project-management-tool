const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
} = require("../controllers/taskController");

router.get("/project/:projectId", auth, getTasks);
router.get("/project/:projectId/status/:status", auth, getTasksByStatus);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
