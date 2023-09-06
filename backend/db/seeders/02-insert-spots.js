"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          //Remember to check database for current Id's bc autoincrement
          ownerId: 1,
          address: "123 Main St",
          city: "Orlando",
          state: "Florida",
          country: "United States",
          lat: 40.7128,
          lng: -74.006,
          name: "Some Spot 1",
          description: "This is a description for Some Spot 1",
          price: 20.5,
        },
        {
          ownerId: 2,
          address: "456 Another St",
          city: "San Francisco",
          state: "California",
          country: "United States",
          lat: 37.7749,
          lng: -122.4194,
          name: "Some Spot 2",
          description: "This is a description for Some Spot 2",
          price: 25.75,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
