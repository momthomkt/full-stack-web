'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Markdowns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            contentHTML: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            contentMarkdown: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            description: {
                type: Sequelize.TEXT('long')
            },
            doctorId: {
                type: Sequelize.INTEGER,
                unique: true
            },
            specialtyId: {
                type: Sequelize.INTEGER,
                unique: true
            },
            clinicId: {
                type: Sequelize.INTEGER,
                unique: true
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
        await queryInterface.dropTable('Markdowns');
    }
};