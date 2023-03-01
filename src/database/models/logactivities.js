'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class logActivities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  logActivities.init({
    createdBy: DataTypes.STRING,
    target: DataTypes.STRING,
    targetId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'logActivities',
  });
  return logActivities;
};