"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "JobPositions",
      [
        {
          title: "Software Engineer",
          department_id: 1, // Engineering
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Senior Software Engineer",
          department_id: 1, // Engineering
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "HR Manager",
          department_id: 2, // Human Resources
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Marketing Specialist",
          department_id: 3, // Marketing
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Financial Analyst",
          department_id: 4, // Finance
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Sales Representative",
          department_id: 5, // Sales
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("JobPositions", null, {});
  },
};
