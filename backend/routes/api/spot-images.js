const express = require("express");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models"); //Always remember to import the models you are going to need in your endpoints!
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const router = express.Router();

// DELETE /api/spot-images/:imageId
router.delete("/:imageId", requireAuth, async (req, res) => {
  try {
    // Get authenticated userId from the middleware
    const userId = req.user.id;

    // Get the imageId from the URL params
    const { imageId } = req.params;

    // Find the SpotImage record by id
    const spotImage = await SpotImage.findByPk(imageId);

    // Check if SpotImage exists
    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // Find the corresponding Spot record
    const spot = await Spot.findByPk(spotImage.spotId);

    // Check if authenticated user is the owner of the Spot
    if (spot.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this Spot Image" });
    }

    // Delete the SpotImage
    await spotImage.destroy();

    // Respond with success message
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
