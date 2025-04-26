"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TalentPool extends Model {
    static associate(models) {
      // Employees (Many-to-Many)
      TalentPool.belongsToMany(models.Employee, {
        through: models.TalentPoolEmployee,
        foreignKey: "talent_pool_id",
      });
    }
  }
  TalentPool.init(
    {
      candidate_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TalentPool",
    }
  );
  return TalentPool;
};
