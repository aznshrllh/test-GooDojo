const router = require("express").Router();
const EmployeeController = require("../controllers/employeeController");

// Get all employees
router.get("/", EmployeeController.getAll);

// Get employee by id
router.get("/:id", EmployeeController.getById);

// Create new employee
router.post("/", EmployeeController.create);

// Update employee
router.put("/:id", EmployeeController.update);

// Delete employee
router.delete("/:id", EmployeeController.delete);

// Add skill to employee
router.post("/skills", EmployeeController.addSkill);

module.exports = router;
