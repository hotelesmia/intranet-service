'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  files.init({
    uuid: DataTypes.STRING,
    masterFileId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    fullKey: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'files',
  });
  return files;
};