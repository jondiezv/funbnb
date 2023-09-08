"use strict";

const { Review } = require("../models");

let options = {};
options.tableName = "Reviews";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const siteReviews = [
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
    userId: 2,
    review: "Nice spot but a bit overcrowded.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 1,
    userId: 3,
    review: "Great view and environment.",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 1,
    userId: 4,
    review: "Absolutely stunning scenery!",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 5,
    userId: 5,
    review: "Good place, but amenities could be improved.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 8,
    userId: 6,
    review: "Visited again, still an amazing place!",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 4,
    userId: 7,
    review: "Good for short stays.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 2,
    userId: 8,
    review: "Best spot for nature lovers.",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 5,
    userId: 8,
    review: "A bit expensive for what it offers.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    spotId: 4,
    userId: 7,
    review: "Could be cleaner.",
    stars: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(siteReviews, {
      validate: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  },
};
