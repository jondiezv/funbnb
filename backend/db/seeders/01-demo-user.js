"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          email: "demo@user.io",
          username: "DemoMan",
          firstName: "Demo",
          lastName: "Man",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "falloutguy@user.io",
          username: "FalloutGuy",
          firstName: "Fallout",
          lastName: "Guy",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          email: "spyman@user.io",
          username: "SpyMan",
          firstName: "Spy",
          lastName: "Man",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          email: "musiclover@user.io",
          username: "MusicLover",
          firstName: "Melody",
          lastName: "Harmon",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          email: "traveljunkie@user.io",
          username: "TravelJunkie",
          firstName: "Travis",
          lastName: "Wander",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          email: "codingmaster@user.io",
          username: "CodeMaster",
          firstName: "Cody",
          lastName: "Script",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          email: "fitnessfreak@user.io",
          username: "FitFreak",
          firstName: "Felicia",
          lastName: "Run",
          hashedPassword: bcrypt.hashSync("password7"),
        },
        {
          email: "gamerpro@user.io",
          username: "GamePro",
          firstName: "Gavin",
          lastName: "Plays",
          hashedPassword: bcrypt.hashSync("password8"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demoman",
            "Falloutguy",
            "Spyman",
            "MusicLover",
            "TravelJunkie",
            "CodeMaster",
            "FitFreak",
            "GamePro",
          ],
        },
      },
      {}
    );
  },
};
