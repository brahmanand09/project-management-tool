const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", auth, getProjects);
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

module.exports = router;
