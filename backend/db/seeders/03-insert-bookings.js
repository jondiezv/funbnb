"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2024-10-01"),
          endDate: new Date("2024-10-03"),
        },
        {
          spotId: 1,
          userId: 2,
          startDate: new Date("2024-11-01"),
          endDate: new Date("2024-11-03"),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2024-12-01"),
          endDate: new Date("2024-12-03"),
        },
        {
          spotId: 3,
          userId: 4,
          startDate: new Date("2024-12-05"),
          endDate: new Date("2024-12-07"),
        },
        {
          spotId: 4,
          userId: 3,
          startDate: new Date("2024-10-15"),
          endDate: new Date("2024-10-17"),
        },
        {
          spotId: 5,
          userId: 5,
          startDate: new Date("2024-11-20"),
          endDate: new Date("2024-11-22"),
        },
        {
          spotId: 6,
          userId: 6,
          startDate: new Date("2024-09-01"),
          endDate: new Date("2024-09-03"),
        },
        {
          spotId: 7,
          userId: 7,
          startDate: new Date("2024-01-15"),
          endDate: new Date("2024-01-17"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] },
        userId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] },
      },
      {}
    );
  },
};
