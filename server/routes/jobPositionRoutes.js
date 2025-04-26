const router = require("express").Router();
const JobPositionController = require("../controllers/jobPositionController");

// Get all job positions
router.get("/", JobPositionController.getAll);

// Get job position by id
router.get("/:id", JobPositionController.getById);

// Create new job position
router.post("/", JobPositionController.create);

// Update job position
router.put("/:id", JobPositionController.update);

// Delete job position
router.delete("/:id", JobPositionController.delete);

module.exports = router;
