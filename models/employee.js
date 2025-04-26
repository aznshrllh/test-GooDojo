"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // Department (Many-to-One)
      Employee.belongsTo(models.Department, {
        foreignKey: "department_id",
      });

      // JobPosition (Many-to-One)
      Employee.belongsTo(models.JobPosition, {
        foreignKey: "job_position_id",
      });

      // Performance (One-to-Many)
      Employee.hasMany(models.Performance, {
        foreignKey: "employee_id",
      });

      // Skills (Many-to-Many)
      Employee.belongsToMany(models.Skill, {
        through: models.EmployeeSkill,
        foreignKey: "employee_id",
      });

      // TalentPool (Many-to-Many)
      Employee.belongsToMany(models.TalentPool, {
        through: models.TalentPoolEmployee,
        foreignKey: "employee_id",
      });
    }
  }
  Employee.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      department_id: DataTypes.INTEGER,
      job_position_id: DataTypes.INTEGER,
      hire_date: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
