const router = require("express").Router();

const employeeRoutes = require("./employeeRoutes");
const departmentRoutes = require("./departmentRoutes");
const jobPositionRoutes = require("./jobPositionRoutes");
const performanceRoutes = require("./performanceRoutes");
const skillRoutes = require("./skillRoutes");
const talentPoolRoutes = require("./talentPoolRoutes");

router.get("/", (req, res) => {
  res.send({ message: "HR Management API is working!" });
});

router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/job-positions", jobPositionRoutes);
router.use("/performances", performanceRoutes);
router.use("/skills", skillRoutes);
router.use("/talent-pools", talentPoolRoutes);

module.exports = router;
