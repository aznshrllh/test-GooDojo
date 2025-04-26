const { TalentPool, Employee } = require("../models");

class TalentPoolController {
  static async getAll(req, res) {
    try {
      const talentPools = await TalentPool.findAll({
        include: { model: Employee },
      });
      res.status(200).json(talentPools);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const talentPool = await TalentPool.findByPk(id, {
        include: { model: Employee },
      });

      if (!talentPool) {
        return res.status(404).json({ message: "Talent pool not found" });
      }

      res.status(200).json(talentPool);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { candidate_name, email, phone, status } = req.body;
      const talentPool = await TalentPool.create({
        candidate_name,
        email,
        phone,
        status,
      });
      res.status(201).json(talentPool);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { candidate_name, email, phone, status } = req.body;

      const talentPool = await TalentPool.findByPk(id);

      if (!talentPool) {
        return res.status(404).json({ message: "Talent pool not found" });
      }

      await TalentPool.update(
        { candidate_name, email, phone, status },
        { where: { id } }
      );

      res.status(200).json({ message: "Talent pool updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const talentPool = await TalentPool.findByPk(id);

      if (!talentPool) {
        return res.status(404).json({ message: "Talent pool not found" });
      }

      await TalentPool.destroy({ where: { id } });
      res.status(200).json({ message: "Talent pool deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add employee to talent pool
  static async addEmployee(req, res) {
    try {
      const { talent_pool_id, employee_id } = req.body;

      const talentPool = await TalentPool.findByPk(talent_pool_id);
      if (!talentPool) {
        return res.status(404).json({ message: "Talent pool not found" });
      }

      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await talentPool.addEmployee(employee);
      res
        .status(201)
        .json({ message: "Employee added to talent pool successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = TalentPoolController;
