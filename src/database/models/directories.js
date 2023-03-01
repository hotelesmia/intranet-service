'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class directories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  directories.init({
    uuid: DataTypes.STRING,
    key: DataTypes.STRING,
    zoneId: DataTypes.INTEGER,
    parentDirectory: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    order: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'directories',
  });
  return directories;
};