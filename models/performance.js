"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Performance extends Model {
    static associate(models) {
      // Employee (Many-to-One)
      Performance.belongsTo(models.Employee, {
        foreignKey: "employee_id",
      });
    }
  }
  Performance.init(
    {
      employee_id: DataTypes.INTEGER,
      evaluation_date: DataTypes.DATE,
      score: DataTypes.INTEGER,
      feedback: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Performance",
    }
  );
  return Performance;
};
