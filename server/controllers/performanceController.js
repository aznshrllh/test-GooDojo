const { Performance, Employee } = require("../models");

class PerformanceController {
  static async getAll(req, res) {
    try {
      const performances = await Performance.findAll({
        include: { model: Employee },
      });
      res.status(200).json(performances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const performance = await Performance.findByPk(id, {
        include: { model: Employee },
      });

      if (!performance) {
        return res
          .status(404)
          .json({ message: "Performance record not found" });
      }

      res.status(200).json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const performances = await Performance.findAll({
        where: { employee_id: employeeId },
        include: { model: Employee },
      });

      res.status(200).json(performances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { employee_id, evaluation_date, score, feedback } = req.body;

      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const performance = await Performance.create({
        employee_id,
        evaluation_date,
        score,
        feedback,
      });

      res.status(201).json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { employee_id, evaluation_date, score, feedback } = req.body;

      const performance = await Performance.findByPk(id);

      if (!performance) {
        return res
          .status(404)
          .json({ message: "Performance record not found" });
      }

      await Performance.update(
        { employee_id, evaluation_date, score, feedback },
        { where: { id } }
      );

      res
        .status(200)
        .json({ message: "Performance record updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const performance = await Performance.findByPk(id);

      if (!performance) {
        return res
          .status(404)
          .json({ message: "Performance record not found" });
      }

      await Performance.destroy({ where: { id } });
      res
        .status(200)
        .json({ message: "Performance record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = PerformanceController;
