const express = require("express");
const { Spot, Review, SpotImage, User } = require("../../db/models"); //Always remember to import the models you are going to need in your endpoints!
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");

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

//Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  try {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: Review,
          attributes: ["stars"],
        },
        {
          model: SpotImage,
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          as: "Owner", //This alias is needed to display Owner in the response body, add alias to spot model on user relationship
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const { Reviews, SpotImages, Owner, ...spotData } = spot.get();

    let numReviews = 0;
    let avgRating = 0;

    if (Reviews.length > 0) {
      numReviews = Reviews.length;
      avgRating =
        Reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews;
    }

    const formattedSpot = {
      ...spotData,
      numReviews,
      avgRating,
      SpotImages,
      Owner,
    };

    res.status(200).json(formattedSpot);
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve spots" });
  }
});

//Create a new spot
const validateCreateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

router.post("/", requireAuth, validateCreateSpot, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const ownerId = req.user.id;

    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  try {
    const spotId = parseInt(req.params.spotId, 10);
    const userId = req.user.id;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    const spotImage = await SpotImage.create({
      spotId,
      url,
      preview,
    });

    return res.status(200).json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
