const router = require("express").Router();
const SkillController = require("../controllers/skillController");

// Get all skills
router.get("/", SkillController.getAll);

// Get skill by id
router.get("/:id", SkillController.getById);

// Create new skill
router.post("/", SkillController.create);

// Update skill
router.put("/:id", SkillController.update);

// Delete skill
router.delete("/:id", SkillController.delete);

module.exports = router;
