"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Departments",
      [
        {
          name: "Engineering",
          location: "Floor 3, East Wing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Human Resources",
          location: "Floor 2, North Wing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Marketing",
          location: "Floor 4, West Wing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Finance",
          location: "Floor 2, South Wing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sales",
          location: "Floor 1, Main Hall",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Departments", null, {});
  },
};
