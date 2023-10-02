"use strict";

const { ReviewImage } = require("../models");

let options = {};
options.tableName = "ReviewImages";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const reviewImages = [
  {
    reviewId: 1,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 2,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 3,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 4,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 5,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 6,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 7,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 8,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 9,
    url: "https://image.com/image.png",
  },
  {
    reviewId: 10,
    url: "https://image.com/image.png",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  },
};
