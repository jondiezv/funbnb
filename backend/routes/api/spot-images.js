const express = require("express");
const { Spot, SpotImage } = require("../../db/models"); //Always remember to import the models you are going to need in your endpoints!
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const router = express.Router();

//Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { imageId } = req.params;

    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    const spot = await Spot.findByPk(spotImage.spotId);

    if (spot.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this Spot Image" });
    }

    await spotImage.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
