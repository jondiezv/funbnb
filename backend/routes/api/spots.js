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
          attributes: ["stars"], //Include the stars from each spot review so we can calculate avg later
        },
        {
          model: SpotImage,
          where: { preview: true }, //Only get SpotImages that have 'preview' set to true
          required: false, //Still get the Spot even if it doesn't have a preview image, we'll just get null :)
        },
      ],
    });

    //Map the spots to include calculated average ratings and previewImage
    const formattedSpots = spots.map((spot) => {
      const { Reviews, SpotImages, ...spotData } = spot.get(); //.get() is used to extract a plain object from the sequelize instance

      const avgRating =
        Reviews.length > 0
          ? Reviews.reduce((acc, review) => acc + review.stars, 0) /
            Reviews.length
          : 0;

      const previewImage = SpotImages.length > 0 ? SpotImages[0].url : null;

      return {
        ...spotData,
        avgRating,
        previewImage,
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving spots" }); //In case I mess up the code, you can set a console log before this to trace the error
  }
});

//Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user.id; //This calls our requireAuth middleware to get the current user id if there is a user logged in

    const spots = await Spot.findAll({
      where: {
        ownerId: currentUserId, //Find all spots, but ONLY get spots owned by the current user
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
      const avgRating =
        Reviews.length > 0
          ? Reviews.reduce((acc, review) => acc + review.stars, 0) /
            Reviews.length
          : 0;
      const previewImage = SpotImages.length > 0 ? SpotImages[0].url : null;
      return {
        ...spotData,
        avgRating,
        previewImage,
      };
    });

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving spots" });
  }
});

module.exports = router;
