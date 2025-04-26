const { Department, Employee } = require("../models");

class DepartmentController {
  static async getAll(req, res) {
    try {
      const departments = await Department.findAll({
        include: { model: Employee },
      });
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id, {
        include: { model: Employee },
      });

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, location } = req.body;
      const department = await Department.create({ name, location });
      res.status(201).json(department);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, location } = req.body;

      const department = await Department.findByPk(id);

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      await Department.update({ name, location }, { where: { id } });

      res.status(200).json({ message: "Department updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      await Department.destroy({ where: { id } });
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DepartmentController;
