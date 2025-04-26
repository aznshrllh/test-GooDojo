"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Skills",
      [
        {
          name: "JavaScript",
          description: "Programming language for web development",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Node.js",
          description: "JavaScript runtime for server-side applications",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "React",
          description: "JavaScript library for building user interfaces",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "SQL",
          description: "Language for managing relational databases",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Project Management",
          description: "Planning, organizing, and overseeing projects",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Marketing Strategy",
          description: "Planning and execution of marketing initiatives",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Financial Analysis",
          description: "Evaluating businesses, projects, and investments",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sales Techniques",
          description: "Methods and approaches for effective selling",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Skills", null, {});
  },
};
