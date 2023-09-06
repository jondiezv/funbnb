"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      //A Review belongs to a single user
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });

      //A Review belongs to a single spot
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });

      //A Review can have many review images
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
      });
    }
  }

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Spot",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
