const router = require("express").Router();
const TalentPoolController = require("../controllers/talentPoolController");

// Get all talent pools
router.get("/", TalentPoolController.getAll);

// Get talent pool by id
router.get("/:id", TalentPoolController.getById);

// Create new talent pool
router.post("/", TalentPoolController.create);

// Update talent pool
router.put("/:id", TalentPoolController.update);

// Delete talent pool
router.delete("/:id", TalentPoolController.delete);

// Add employee to talent pool
router.post("/employees", TalentPoolController.addEmployee);

module.exports = router;
