"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          preview: true,
          url: "https://example.com/spot-image1.jpg",
        },
        {
          spotId: 1,
          preview: true,
          url: "https://example.com/spot-image2.jpg",
        },
        {
          spotId: 2,
          preview: true,
          url: "https://example.com/spot-image3.jpg",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
