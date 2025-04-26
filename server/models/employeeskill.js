"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeSkill extends Model {
    static associate(models) {
      // define association here
    }
  }
  EmployeeSkill.init(
    {
      employee_id: DataTypes.INTEGER,
      skill_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EmployeeSkill",
    }
  );
  return EmployeeSkill;
};
