const express = require("express");
const { Spot, Review, SpotImage } = require("../../db/models"); // Adjust to where your models are located

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: Review,
          attributes: ["stars"], //include the stars from each spot review so we can calculate avg later
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

module.exports = router;
