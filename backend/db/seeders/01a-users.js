"use strict";

let options = {};
options.tableName = "Users";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const bcrypt = require("bcryptjs");
const { User } = require("../models");

const siteUsers = [
  {
    username: "SarahM",
    email: "sarahM@example.com",
    hashedPassword: bcrypt.hashSync("sarahPass123"),
    firstName: "Sarah",
    lastName: "Morgan",
  },
  {
    username: "JohnD",
    email: "johnDoe@gmail.com",
    hashedPassword: bcrypt.hashSync("johnDoePassword"),
    firstName: "John",
    lastName: "Doe",
  },
  {
    username: "EmilyR",
    email: "emily.rose@me.com",
    hashedPassword: bcrypt.hashSync("emilyRosePass"),
    firstName: "Emily",
    lastName: "Rose",
  },
  {
    username: "KevinT",
    email: "kevinT@aol.com",
    hashedPassword: bcrypt.hashSync("kevinTPassword!"),
    firstName: "Kevin",
    lastName: "Thomas",
  },
  {
    username: "JaneS",
    email: "jane.smith@hotmail.com",
    hashedPassword: bcrypt.hashSync("janeSmithPass"),
    firstName: "Jane",
    lastName: "Smith",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(siteUsers, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  },
};
