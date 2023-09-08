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
          spotId: 2,
          preview: true,
          url: "https://example.com/spot-image2.jpg",
        },
        {
          spotId: 3,
          preview: true,
          url: "https://example.com/spot-image3.jpg",
        },
        {
          spotId: 4,
          preview: true,
          url: "https://example.com/spot-image4.jpg",
        },
        {
          spotId: 5,
          preview: true,
          url: "https://example.com/spot-image5.jpg",
        },
        {
          spotId: 6,
          preview: true,
          url: "https://example.com/spot-image6.jpg",
        },
        {
          spotId: 7,
          preview: true,
          url: "https://example.com/spot-image7.jpg",
        },
        {
          spotId: 8,
          preview: true,
          url: "https://example.com/spot-image8.jpg",
        },
        {
          spotId: 9,
          preview: true,
          url: "https://example.com/spot-image9.jpg",
        },
        {
          spotId: 10,
          preview: true,
          url: "https://example.com/spot-image10.jpg",
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
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      },
      {}
    );
  },
};
