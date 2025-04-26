"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TalentPoolEmployee extends Model {
    static associate(models) {
      // define association here
    }
  }
  TalentPoolEmployee.init(
    {
      talent_pool_id: DataTypes.INTEGER,
      employee_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TalentPoolEmployee",
    }
  );
  return TalentPoolEmployee;
};
