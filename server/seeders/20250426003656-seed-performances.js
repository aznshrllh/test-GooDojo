"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Performances",
      [
        {
          employee_id: 1, // John Doe
          evaluation_date: new Date("2023-12-15"),
          score: 85,
          feedback:
            "John has shown excellent progress in project delivery and code quality. Could improve on documentation.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 1, // John Doe (second evaluation)
          evaluation_date: new Date("2024-06-15"),
          score: 90,
          feedback:
            "John continues to excel in development tasks and has improved documentation significantly.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 2, // Jane Smith
          evaluation_date: new Date("2023-12-15"),
          score: 95,
          feedback:
            "Jane consistently delivers high-quality code and is an excellent team mentor.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 3, // Robert Johnson
          evaluation_date: new Date("2023-12-20"),
          score: 88,
          feedback:
            "Robert has effectively managed the HR team and implemented several process improvements.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 4, // Emily Davis
          evaluation_date: new Date("2024-01-10"),
          score: 82,
          feedback:
            "Emily has developed creative marketing campaigns. Needs to improve on analytics reporting.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 5, // Michael Wilson
          evaluation_date: new Date("2023-11-25"),
          score: 91,
          feedback:
            "Michael produces detailed financial analyses that have helped with budget optimization.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employee_id: 6, // Sarah Brown
          evaluation_date: new Date("2023-10-15"),
          score: 87,
          feedback:
            "Sarah has exceeded her sales targets for two consecutive quarters.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Performances", null, {});
  },
};
