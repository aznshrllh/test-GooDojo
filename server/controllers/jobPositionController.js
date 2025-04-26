const { JobPosition, Department } = require("../models");

class JobPositionController {
  static async getAll(req, res) {
    try {
      const positions = await JobPosition.findAll({
        include: { model: Department },
      });
      res.status(200).json(positions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const position = await JobPosition.findByPk(id, {
        include: { model: Department },
      });

      if (!position) {
        return res.status(404).json({ message: "Job position not found" });
      }

      res.status(200).json(position);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { title, department_id } = req.body;
      const position = await JobPosition.create({ title, department_id });
      res.status(201).json(position);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, department_id } = req.body;

      const position = await JobPosition.findByPk(id);

      if (!position) {
        return res.status(404).json({ message: "Job position not found" });
      }

      await JobPosition.update({ title, department_id }, { where: { id } });

      res.status(200).json({ message: "Job position updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const position = await JobPosition.findByPk(id);

      if (!position) {
        return res.status(404).json({ message: "Job position not found" });
      }

      await JobPosition.destroy({ where: { id } });
      res.status(200).json({ message: "Job position deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = JobPositionController;
