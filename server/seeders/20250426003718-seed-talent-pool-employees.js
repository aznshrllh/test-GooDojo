"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TalentPoolEmployees",
      [
        {
          talent_pool_id: 1, // Leadership Development
          employee_id: 2, // Jane Smith
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 1, // Leadership Development
          employee_id: 3, // Robert Johnson
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 2, // Technical Excellence
          employee_id: 1, // John Doe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 2, // Technical Excellence
          employee_id: 2, // Jane Smith
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 3, // Innovation Team
          employee_id: 1, // John Doe
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 3, // Innovation Team
          employee_id: 4, // Emily Davis
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          talent_pool_id: 4, // Customer Experience
          employee_id: 6, // Sarah Brown
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TalentPoolEmployees", null, {});
  },
};
