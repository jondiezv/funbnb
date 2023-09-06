const express = require("express");
const { Spot, Review, SpotImage } = require("../../db/models"); //Always remember to import the models you are going to need in your endpoints
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//Return all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: Review,
          attributes: ["stars"],
        },
        {
          model: SpotImage,
          where: { preview: true },
          required: false,
        },
      ],
    });

    const formattedSpots = spots.map((spot) => {
      const { Reviews, SpotImages, ...spotData } = spot.get();

      let avgRating = 0;
      if (Reviews.length > 0) {
        avgRating =
          Reviews.reduce((acc, review) => acc + review.stars, 0) /
          Reviews.length;
      }

      let previewImage = null;
      if (SpotImages.length > 0) {
        previewImage = SpotImages[0].url;
      }

      return {
        ...spotData,
        avgRating,
        previewImage,
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve spots" });
  }
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const spots = await Spot.findAll({
      where: {
        ownerId: currentUserId,
      },
      include: [
        {
          model: Review,
          attributes: ["stars"],
        },
        {
          model: SpotImage,
          where: { preview: true },
          required: false,
        },
      ],
    });

    const formattedSpots = spots.map((spot) => {
      const { Reviews, SpotImages, ...spotData } = spot.get();

      let avgRating = 0;
      if (Reviews.length > 0) {
        avgRating =
          Reviews.reduce((acc, review) => acc + review.stars, 0) /
          Reviews.length;
      }

      let previewImage = null;
      if (SpotImages.length > 0) {
        previewImage = SpotImages[0].url;
      }

      return {
        ...spotData,
        avgRating,
        previewImage,
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve spots" });
  }
});

module.exports = router;
