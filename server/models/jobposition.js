"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobPosition extends Model {
    static associate(models) {
      // Employees (One-to-Many)
      JobPosition.hasMany(models.Employee, {
        foreignKey: "job_position_id",
      });

      // Department (Many-to-One)
      JobPosition.belongsTo(models.Department, {
        foreignKey: "department_id",
      });
    }
  }
  JobPosition.init(
    {
      title: DataTypes.STRING,
      department_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "JobPosition",
    }
  );
  return JobPosition;
};
