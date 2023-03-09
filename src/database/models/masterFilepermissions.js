'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class masterFilePermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  masterFilePermissions.init({
    allowTo: DataTypes.INTEGER,
    roleGroupKey: DataTypes.STRING,
    masterFileId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    stauts: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'masterFilePermissions',
  });
  return masterFilePermissions;
};