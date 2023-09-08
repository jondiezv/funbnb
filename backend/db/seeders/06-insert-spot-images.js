"use strict";

const { SpotImage } = require("../models");

let options = {};
options.tableName = "SpotImages";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const spotImages = [
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
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  },
};
