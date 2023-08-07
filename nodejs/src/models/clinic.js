'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //Clinic.belongsTo(models.Doctor_info, { foreignKey: 'id', targetKey: 'clinicId', as: 'DoctorInfoData' })
            Clinic.hasMany(models.Doctor_info, { foreignKey: 'clinicId', as: 'arrDoctorData' })
        }
    };
    Clinic.init({
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        desHTML: DataTypes.TEXT('long'),
        desMarkdown: DataTypes.TEXT('long'),
        address: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};