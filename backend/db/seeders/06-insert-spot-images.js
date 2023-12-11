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
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 1,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 1,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 1,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 1,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 2,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842641167794228/image.png",
  },
  {
    spotId: 2,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842641167794228/image.png",
  },
  {
    spotId: 2,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842641167794228/image.png",
  },
  {
    spotId: 2,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842641167794228/image.png",
  },
  {
    spotId: 2,
    preview: false,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842641167794228/image.png",
  },
  {
    spotId: 3,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842865382695042/TAL-hidden-haven-villa-south-africa-airbnb-NEWBNBCAT0123-0e3c6ef5dce0490aac7dd5cd92b27f33.jpg",
  },
  {
    spotId: 3,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842865382695042/TAL-hidden-haven-villa-south-africa-airbnb-NEWBNBCAT0123-0e3c6ef5dce0490aac7dd5cd92b27f33.jpg",
  },
  {
    spotId: 3,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842865382695042/TAL-hidden-haven-villa-south-africa-airbnb-NEWBNBCAT0123-0e3c6ef5dce0490aac7dd5cd92b27f33.jpg",
  },
  {
    spotId: 3,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842865382695042/TAL-hidden-haven-villa-south-africa-airbnb-NEWBNBCAT0123-0e3c6ef5dce0490aac7dd5cd92b27f33.jpg",
  },
  {
    spotId: 3,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183842865382695042/TAL-hidden-haven-villa-south-africa-airbnb-NEWBNBCAT0123-0e3c6ef5dce0490aac7dd5cd92b27f33.jpg",
  },
  {
    spotId: 4,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843018290241546/Modernist-home-with-pool-roof-deck-santa-monica-los-angeles-rental.jpg",
  },
  {
    spotId: 4,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843018290241546/Modernist-home-with-pool-roof-deck-santa-monica-los-angeles-rental.jpg",
  },
  {
    spotId: 4,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843018290241546/Modernist-home-with-pool-roof-deck-santa-monica-los-angeles-rental.jpg",
  },
  {
    spotId: 4,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843018290241546/Modernist-home-with-pool-roof-deck-santa-monica-los-angeles-rental.jpg",
  },
  {
    spotId: 4,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843018290241546/Modernist-home-with-pool-roof-deck-santa-monica-los-angeles-rental.jpg",
  },
  {
    spotId: 5,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843198297178112/ShangriLaLa-Tiny-House-Mountaintop-Getaway-Topanga-CA.webp",
  },
  {
    spotId: 5,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843198297178112/ShangriLaLa-Tiny-House-Mountaintop-Getaway-Topanga-CA.webp",
  },
  {
    spotId: 5,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843198297178112/ShangriLaLa-Tiny-House-Mountaintop-Getaway-Topanga-CA.webp",
  },
  {
    spotId: 5,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843198297178112/ShangriLaLa-Tiny-House-Mountaintop-Getaway-Topanga-CA.webp",
  },
  {
    spotId: 5,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1183843198297178112/ShangriLaLa-Tiny-House-Mountaintop-Getaway-Topanga-CA.webp",
  },

  {
    spotId: 6,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 6,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 6,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 6,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 6,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 7,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 7,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 7,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 7,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 7,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 8,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 8,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 8,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 8,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 8,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 9,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 9,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 9,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 9,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 9,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 10,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 10,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 10,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 10,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
  },
  {
    spotId: 10,
    preview: true,
    url: "https://cdn.discordapp.com/attachments/1155927455580823562/1155927465978503298/buying-a-house-in-orlando.webp",
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
