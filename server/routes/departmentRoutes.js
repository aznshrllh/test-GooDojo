const router = require("express").Router();
const DepartmentController = require("../controllers/departmentController");

// Get all departments
router.get("/", DepartmentController.getAll);

// Get department by id
router.get("/:id", DepartmentController.getById);

// Create new department
router.post("/", DepartmentController.create);

// Update department
router.put("/:id", DepartmentController.update);

// Delete department
router.delete("/:id", DepartmentController.delete);

module.exports = router;
