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
const { Op } = require("sequelize");

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

//Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = parseInt(req.params.bookingId, 10);
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (new Date() > new Date(booking.endDate)) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this booking" });
    }

    const conflictingBooking = await Booking.findOne({
      where: {
        id: { [Op.ne]: bookingId },
        spotId: booking.spotId,
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

    booking.startDate = new Date(startDate);
    booking.endDate = new Date(endDate);
    await booking.save();

    return res.status(200).json({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });
  } catch (error) {
    next(error);
  }
});

//Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = parseInt(req.params.bookingId, 10);
  const userId = req.user.id;

  try {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (new Date() >= new Date(booking.startDate)) {
      return res
        .status(403)
        .json({ message: "Bookings that have been started can't be deleted" });
    }

    const spot = await Spot.findByPk(booking.spotId);

    if (booking.userId !== userId && spot.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this booking" });
    }

    await booking.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
