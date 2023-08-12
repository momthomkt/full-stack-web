'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Clinics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nameVi: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            nameEn: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            provinceId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            desHTML: {
                type: Sequelize.TEXT('long')
            },
            desMarkdown: {
                type: Sequelize.TEXT('long')
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Clinics');
    }
};