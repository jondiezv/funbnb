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

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
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
      ],
      attributes: [
        "id",
        "spotId",
        "userId",
        "startDate",
        "endDate",
        "createdAt",
        "updatedAt",
      ],
    });

    const formattedBookings = bookings.map((booking) => {
      const plainBooking = booking.get({ plain: true });

      if (
        plainBooking.Spot.SpotImages &&
        plainBooking.Spot.SpotImages.length > 0
      ) {
        plainBooking.Spot.previewImage = plainBooking.Spot.SpotImages[0].url;
      }

      delete plainBooking.Spot.SpotImages;

      const {
        id,
        spotId,
        userId,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        Spot,
      } = plainBooking;

      return {
        id,
        spotId,
        Spot: {
          id: Spot.id,
          ownerId: Spot.ownerId,
          address: Spot.address,
          city: Spot.city,
          state: Spot.state,
          country: Spot.country,
          lat: Spot.lat,
          lng: Spot.lng,
          name: Spot.name,
          price: Spot.price,
          previewImage: Spot.previewImage,
        },
        userId,
        startDate,
        endDate,
        createdAt,
        updatedAt,
      };
    });

    res.status(200).json({ Bookings: formattedBookings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
