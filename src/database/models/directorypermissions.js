'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class directoryPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  directoryPermissions.init({
    userId: DataTypes.INTEGER,
    roleGroupKey: DataTypes.STRING,
    directoryId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'directoryPermissions',
  });
  return directoryPermissions;
};