"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Elanore",
          lastName: "Thompson",
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "George",
          lastName: "Wright",
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Franklin",
          lastName: "Steele",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkDelete(
      options,
      {
        username: ["Demo-lition", "FakeUser1", "FakeUser2"],
      },
      {}
    );
  },
};
