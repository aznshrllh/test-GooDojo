const { Skill, Employee, EmployeeSkill } = require("../models");

class SkillController {
  static async getAll(req, res) {
    try {
      const skills = await Skill.findAll({
        include: { model: Employee },
      });
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const skill = await Skill.findByPk(id, {
        include: { model: Employee },
      });

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, description } = req.body;
      const skill = await Skill.create({ name, description });
      res.status(201).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const skill = await Skill.findByPk(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      await Skill.update({ name, description }, { where: { id } });

      res.status(200).json({ message: "Skill updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const skill = await Skill.findByPk(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      await Skill.destroy({ where: { id } });
      res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = SkillController;
