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
          ownerId: 1,
          address: "123 Main St",
          city: "Orlando",
          state: "Florida",
          country: "United States",
          lat: 40.7128,
          lng: -74.006,
          name: "Orlando Lakeside Retreat",
          description:
            "A tranquil lakeside retreat located in the heart of Orlando. Perfect for a weekend getaway.",
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
          name: "Golden Gate View Loft",
          description:
            "Located in downtown San Francisco, this loft offers a stunning view of the Golden Gate Bridge. Ideal for tourists and business travelers alike.",
          price: 25.75,
        },
        {
          ownerId: 3,
          address: "789 Sunset Blvd",
          city: "Los Angeles",
          state: "California",
          country: "United States",
          lat: 34.0522,
          lng: -118.2437,
          name: "LA Oasis",
          description: "Experience the LA lifestyle.",
          price: 30.5,
        },
        {
          ownerId: 4,
          address: "101 Park Ave",
          city: "New York",
          state: "New York",
          country: "United States",
          lat: 40.7128,
          lng: -74.006,
          name: "Central Spot",
          description: "Close to everything you need in NY.",
          price: 35.75,
        },
        {
          ownerId: 5,
          address: "404 Not Found St",
          city: "San Jose",
          state: "California",
          country: "United States",
          lat: 37.3382,
          lng: -121.8863,
          name: "Tech Haven",
          description: "For those who love technology.",
          price: 40.0,
        },
        {
          ownerId: 6,
          address: "600 Commerce St",
          city: "Dallas",
          state: "Texas",
          country: "United States",
          lat: 32.7767,
          lng: -96.797,
          name: "Cowboy Lounge",
          description: "Experience southern hospitality.",
          price: 25.0,
        },
        {
          ownerId: 7,
          address: "700 Lake St",
          city: "Chicago",
          state: "Illinois",
          country: "United States",
          lat: 41.8781,
          lng: -87.6298,
          name: "Windy Haven",
          description: "In the heart of Chicago.",
          price: 33.5,
        },
        {
          ownerId: 8,
          address: "800 Broadway",
          city: "Nashville",
          state: "Tennessee",
          country: "United States",
          lat: 36.1627,
          lng: -86.7816,
          name: "Music City Spot",
          description: "For the love of music.",
          price: 22.5,
        },
        {
          ownerId: 1,
          address: "900 Ocean Dr",
          city: "Miami",
          state: "Florida",
          country: "United States",
          lat: 25.7617,
          lng: -80.1918,
          name: "Beachside Spot",
          description: "Feel the ocean breeze.",
          price: 45.0,
        },
        {
          ownerId: 2,
          address: "1000 Mountain Rd",
          city: "Denver",
          state: "Colorado",
          country: "United States",
          lat: 39.7392,
          lng: -104.9903,
          name: "Rocky Spot",
          description: "In the mountain range.",
          price: 35.0,
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
        ownerId: {
          [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
        },
      },
      {}
    );
  },
};
