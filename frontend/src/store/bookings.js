import { csrfFetch } from "./csrf";

const GET_USER_BOOKINGS = "bookings/getUserBookings";
const CREATE_BOOKING = "bookings/createBooking";

export const getUserBookings = (bookings) => ({
  type: GET_USER_BOOKINGS,
  bookings,
});

export const createBooking = (booking) => ({
  type: CREATE_BOOKING,
  booking,
});

export const fetchUserBookings = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/bookings/current");
    const data = await res.json();
    dispatch(getUserBookings(data.Bookings));
  } catch (error) {
    console.error("Error fetching user bookings:", error);
  }
};

export const createNewBooking =
  (spotId, startDate, endDate) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (res.ok) {
        const newBooking = await res.json();
        dispatch(createBooking(newBooking));
        return newBooking;
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

const initialState = {
  userBookings: [],
};

const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_BOOKINGS:
      return {
        ...state,
        userBookings: action.bookings,
      };
    case CREATE_BOOKING:
      return {
        ...state,
        userBookings: [...state.userBookings, action.booking],
      };
    default:
      return state;
  }
};

export default bookingsReducer;
