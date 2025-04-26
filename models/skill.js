"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      // Employees (Many-to-Many)
      Skill.belongsToMany(models.Employee, {
        through: models.EmployeeSkill,
        foreignKey: "skill_id",
      });
    }
  }
  Skill.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Skill",
    }
  );
  return Skill;
};
