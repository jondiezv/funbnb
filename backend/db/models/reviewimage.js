"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      //Each review image belongs to one review
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
      });
    }
  }
  ReviewImage.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Review",
          key: "id",
        },
      },
      url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};
