const {
  Employee,
  Department,
  JobPosition,
  Performance,
  Skill,
} = require("../models");

class EmployeeController {
  static async getAll(req, res) {
    try {
      const employees = await Employee.findAll({
        include: [
          { model: Department },
          { model: JobPosition },
          { model: Performance },
          { model: Skill },
        ],
      });
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id, {
        include: [
          { model: Department },
          { model: JobPosition },
          { model: Performance },
          { model: Skill },
        ],
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const {
        name,
        email,
        phone,
        department_id,
        job_position_id,
        hire_date,
        status,
      } = req.body;

      const employee = await Employee.create({
        name,
        email,
        phone,
        department_id,
        job_position_id,
        hire_date,
        status,
      });

      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        department_id,
        job_position_id,
        hire_date,
        status,
      } = req.body;

      const employee = await Employee.findByPk(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await Employee.update(
        {
          name,
          email,
          phone,
          department_id,
          job_position_id,
          hire_date,
          status,
        },
        { where: { id } }
      );

      res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await Employee.destroy({ where: { id } });
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add skills to employee
  static async addSkill(req, res) {
    try {
      const { employee_id, skill_id } = req.body;

      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const skill = await Skill.findByPk(skill_id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      await employee.addSkill(skill);
      res.status(201).json({ message: "Skill added to employee successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = EmployeeController;
