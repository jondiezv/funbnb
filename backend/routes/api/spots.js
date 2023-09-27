const express = require("express");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check, query, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const router = express.Router();
const { Op } = require("sequelize");

//Get all spots with query params
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("size").optional().isInt({ min: 1, max: 100 }),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("minLat").optional().isFloat(),
    query("maxLat").optional().isFloat(),
    query("minLng").optional().isFloat(),
    query("maxLng").optional().isFloat(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { page, size, minPrice, maxPrice, minLat, maxLat, minLng, maxLng } =
        req.query;

      if (!page) {
        page = 1;
      } else {
        page = parseInt(page);
      }

      if (!size) {
        size = 20;
      } else {
        size = parseInt(size);
      }

      const whereClause = {};

      if (minPrice !== undefined) whereClause.price = { [Op.gte]: minPrice };
      if (maxPrice !== undefined)
        whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };
      if (minLat !== undefined) whereClause.lat = { [Op.gte]: minLat };
      if (maxLat !== undefined)
        whereClause.lat = { ...whereClause.lat, [Op.lte]: maxLat };
      if (minLng !== undefined) whereClause.lng = { [Op.gte]: minLng };
      if (maxLng !== undefined)
        whereClause.lng = { ...whereClause.lng, [Op.lte]: maxLng };

      const spots = await Spot.findAll({
        where: whereClause,
        include: [
          { model: Review, attributes: ["stars"] },
          { model: SpotImage, where: { preview: true }, required: false },
        ],
        limit: size,
        offset: (page - 1) * size,
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

        return { ...spotData, avgRating, previewImage };
      });

      res.status(200).json({ Spots: formattedSpots, page, size });
    } catch (error) {
      res.status(500).json({ message: "Error getting data" }); //If I hit this then it's likely a logic error
    }
  }
);

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
    res.status(500).json({ message: "Error getting data" }); //If I hit this then it's likely a logic error
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
    res.status(500).json({ message: "Error getting data" }); //If I hit this then it's likely a logic error
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

//Edit a Spot
const validateSpotUpdate = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat").isFloat().withMessage("Latitude is not valid"),
  check("lng").isFloat().withMessage("Longitude is not valid"),
  check("name")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price").isFloat({ min: 0 }).withMessage("Price per day is required"),
  handleValidationErrors,
];

router.put(
  "/:spotId",
  requireAuth,
  validateSpotUpdate,
  async (req, res, next) => {
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

    const spotId = parseInt(req.params.spotId, 10);

    try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found",
        });
      }

      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
          message: "You are not authorized to update this spot.",
        });
      }

      spot.address = address;
      spot.city = city;
      spot.state = state;
      spot.country = country;
      spot.lat = lat;
      spot.lng = lng;
      spot.name = name;
      spot.description = description;
      spot.price = price;

      await spot.save();

      return res.status(200).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId, 10);

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this spot.",
      });
    }

    await spot.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    next(err);
  }
});

//Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  try {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    res.status(200).json({ Reviews: reviews });
  } catch (err) {
    res.status(500).json({ message: "An error occurred" });
  }
});

//Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  [
    check("review").notEmpty().withMessage("Review text is required"),
    check("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const existingReview = await Review.findOne({ where: { userId, spotId } });
    if (existingReview) {
      return res
        .status(403)
        .json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    return res.status(201).json(newReview);
  }
);

//Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId, 10);
  const currentUserId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    let bookings;
    if (spot.ownerId === currentUserId) {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: [
          "id",
          "userId",
          "spotId",
          "startDate",
          "endDate",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    } else {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
    }

    const formattedBookings = bookings.map((booking) => {
      const plainBooking = booking.get({ plain: true });

      if (spot.ownerId === currentUserId) {
        return {
          User: {
            id: plainBooking.User.id,
            firstName: plainBooking.User.firstName,
            lastName: plainBooking.User.lastName,
          },
          id: plainBooking.id,
          spotId: plainBooking.spotId,
          userId: plainBooking.userId,
          startDate: plainBooking.startDate,
          endDate: plainBooking.endDate,
          createdAt: plainBooking.createdAt,
          updatedAt: plainBooking.updatedAt,
        };
      } else {
        return {
          spotId: plainBooking.spotId,
          startDate: plainBooking.startDate,
          endDate: plainBooking.endDate,
        };
      }
    });

    res.status(200).json({ Bookings: formattedBookings });
  } catch (err) {
    next(err);
  }
});

//Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId, 10);
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
      return res.status(403).json({ message: "You can't book your own spot" });
    }

    const conflictingBooking = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)],
            },
          },
          {
            endDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: new Date(startDate) } },
              { endDate: { [Op.gte]: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const newBooking = await Booking.create({
      spotId,
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return res.status(200).json({
      id: newBooking.id,
      spotId: newBooking.spotId,
      userId: newBooking.userId,
      startDate: newBooking.startDate.toISOString().split("T")[0],
      endDate: newBooking.endDate.toISOString().split("T")[0],
      createdAt: newBooking.createdAt,
      updatedAt: newBooking.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
