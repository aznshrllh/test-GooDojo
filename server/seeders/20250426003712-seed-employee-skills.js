"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "EmployeeSkills",
      [
        {
          employee_id: 1, // John Doe
          skill_id: 1, // JavaScript
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 1, // John Doe
          skill_id: 2, // Node.js
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 2, // Jane Smith
          skill_id: 1, // JavaScript
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 2, // Jane Smith
          skill_id: 2, // Node.js
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 2, // Jane Smith
          skill_id: 3, // React
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 3, // Robert Johnson
          skill_id: 5, // Project Management
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 4, // Emily Davis
          skill_id: 6, // Marketing Strategy
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 5, // Michael Wilson
          skill_id: 7, // Financial Analysis
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 5, // Michael Wilson
          skill_id: 4, // SQL
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 6, // Sarah Brown
          skill_id: 8, // Sales Techniques
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("EmployeeSkills", null, {});
  },
};
