"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Employees",
      [
        {
          name: "John Doe",
          email: "john.doe@company.com",
          phone: "555-123-4567",
          department_id: 1, // Engineering
          job_position_id: 1, // Software Engineer
          hire_date: new Date("2023-01-15"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Smith",
          email: "jane.smith@company.com",
          phone: "555-123-5678",
          department_id: 1, // Engineering
          job_position_id: 2, // Senior Software Engineer
          hire_date: new Date("2021-03-20"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Robert Johnson",
          email: "robert.johnson@company.com",
          phone: "555-123-7890",
          department_id: 2, // Human Resources
          job_position_id: 3, // HR Manager
          hire_date: new Date("2022-05-10"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Emily Davis",
          email: "emily.davis@company.com",
          phone: "555-123-2345",
          department_id: 3, // Marketing
          job_position_id: 4, // Marketing Specialist
          hire_date: new Date("2023-02-15"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Michael Wilson",
          email: "michael.wilson@company.com",
          phone: "555-123-3456",
          department_id: 4, // Finance
          job_position_id: 5, // Financial Analyst
          hire_date: new Date("2022-11-05"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sarah Brown",
          email: "sarah.brown@company.com",
          phone: "555-123-8901",
          department_id: 5, // Sales
          job_position_id: 6, // Sales Representative
          hire_date: new Date("2023-04-15"),
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Employees", null, {});
  },
};
