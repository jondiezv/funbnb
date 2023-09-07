const express = require("express");
const { Review, ReviewImage } = require("../../db/models"); //Always remember to import the models you are going to need in your endpoints!
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const router = express.Router();

//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const currentUserId = req.user.id;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (!review || review.userId !== currentUserId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this Review Image" });
    }

    await reviewImage.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
