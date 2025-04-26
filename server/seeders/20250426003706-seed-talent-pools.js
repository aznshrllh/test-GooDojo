"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TalentPools",
      [
        {
          candidate_name: "Leadership Development",
          email: "leadership@company.com",
          phone: "555-100-1000",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          candidate_name: "Technical Excellence",
          email: "tech@company.com",
          phone: "555-200-2000",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          candidate_name: "Innovation Team",
          email: "innovation@company.com",
          phone: "555-300-3000",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          candidate_name: "Customer Experience",
          email: "cx@company.com",
          phone: "555-400-4000",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TalentPools", null, {});
  },
};
