const express = require("express");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const router = express.Router();

//Get all reviews by current user
router.get("/current", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
          include: [
            {
              model: SpotImage,
              where: { preview: true },
              attributes: ["url"],
              required: false,
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    if (!reviews) {
      return res
        .status(404)
        .json({ error: "No reviews found for current user" });
    }

    const formattedReviews = reviews.map((review) => {
      const {
        id,
        spotId,
        userId,
        review: reviewText,
        stars,
        createdAt,
        updatedAt,
        User,
        Spot,
        ReviewImages,
      } = review.toJSON();

      let previewImage = null;
      if (Spot.SpotImages && Spot.SpotImages.length > 0) {
        previewImage = Spot.SpotImages[0].url;
      }

      const { SpotImages, lat, lng, price, ...restOfSpot } = Spot;

      return {
        id,
        userId,
        spotId,
        review: reviewText,
        stars,
        createdAt,
        updatedAt,
        User,
        Spot: {
          ...restOfSpot,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          price: parseFloat(price),
          previewImage,
        },
        ReviewImages,
      };
    });

    res.status(200).json({ Reviews: formattedReviews });
  } catch (err) {
    console.log("Error:", err);
    res
      .status(500)
      .json({ error: "If you hit this error check your code logic" });
  }
});

//Add an Image to a Review based on the Review's id
router.post(
  "/:reviewId/images",
  requireAuth,
  [check("url").notEmpty().withMessage("Image URL is required")],
  handleValidationErrors,
  async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const imageCount = await ReviewImage.count({ where: { reviewId } });
    if (imageCount >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    res.status(200).json({
      id: newImage.id,
      url: newImage.url,
    });
  }
);

//Edit a Review
router.put(
  "/:reviewId",
  requireAuth,
  [
    check("review").notEmpty().withMessage("Review text is required"),
    check("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    const reviewId = parseInt(req.params.reviewId, 10);
    const { review, stars } = req.body;
    const userId = req.user.id;

    try {
      const existingReview = await Review.findByPk(reviewId);

      if (!existingReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      existingReview.review = review;
      existingReview.stars = stars;
      await existingReview.save();

      res.status(200).json({
        id: existingReview.id,
        userId: existingReview.userId,
        spotId: existingReview.spotId,
        review: existingReview.review,
        stars: existingReview.stars,
        createdAt: existingReview.createdAt,
        updatedAt: existingReview.updatedAt,
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((e) => e.message);
        return res.status(400).json({ message: "Validation error", errors });
      }
      next(err);
    }
  }
);

//Delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId, 10);
  const userId = req.user.id;

  try {
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ReviewImage.destroy({ where: { reviewId: existingReview.id } });

    await existingReview.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
