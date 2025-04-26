const router = require("express").Router();
const PerformanceController = require("../controllers/performanceController");

// Get all performance records
router.get("/", PerformanceController.getAll);

// Get performance record by id
router.get("/:id", PerformanceController.getById);

// Get performance records by employee
router.get("/employee/:employeeId", PerformanceController.getByEmployee);

// Create new performance record
router.post("/", PerformanceController.create);

// Update performance record
router.put("/:id", PerformanceController.update);

// Delete performance record
router.delete("/:id", PerformanceController.delete);

module.exports = router;
