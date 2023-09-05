"use strict";
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review: "Amazing spot, would love to visit again!",
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          userId: 1,
          review: "Nice spot but a bit overcrowded.",
          stars: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 1,
          userId: 2,
          review: "Great view and environment.",
          stars: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more entries as you like
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2] }, // Change these IDs based on the user IDs you've used in the 'up' method
      },
      {}
    );
  },
};
