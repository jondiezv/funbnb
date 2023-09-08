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
    url: "https://example.com/image1.jpg",
  },
  {
    reviewId: 2,
    url: "https://example.com/image2.jpg",
  },
  {
    reviewId: 3,
    url: "https://example.com/image3.jpg",
  },
  {
    reviewId: 4,
    url: "https://example.com/image4.jpg",
  },
  {
    reviewId: 5,
    url: "https://example.com/image5.jpg",
  },
  {
    reviewId: 6,
    url: "https://example.com/image6.jpg",
  },
  {
    reviewId: 7,
    url: "https://example.com/image7.jpg",
  },
  {
    reviewId: 8,
    url: "https://example.com/image8.jpg",
  },
  {
    reviewId: 9,
    url: "https://example.com/image9.jpg",
  },
  {
    reviewId: 10,
    url: "https://example.com/image10.jpg",
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
