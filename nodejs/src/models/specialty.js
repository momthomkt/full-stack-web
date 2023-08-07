'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //Specialty.belongsTo(models.Doctor_info, { foreignKey: 'id', targetKey: 'specialtyId', as: 'DoctorInfoData' })
            Specialty.hasMany(models.Doctor_info, { foreignKey: 'specialtyId', as: 'arrDoctorData' })
        }
    };
    Specialty.init({
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        desHTML: DataTypes.TEXT('long'),
        //contentMarkDown: DataTypes.TEXT('long'),
        desMarkdown: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};