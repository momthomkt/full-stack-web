'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Specialties', {
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
            image: {
                type: Sequelize.BLOB('long')
            },
            desHTML: {
                type: Sequelize.TEXT('long')
            },
            // contentMarkDown: {
            //     type: Sequelize.TEXT('long')
            // },
            desMarkdown: {
                type: Sequelize.TEXT('long')
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
        await queryInterface.dropTable('Specialties');
    }
};