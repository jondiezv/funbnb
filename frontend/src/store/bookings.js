import { csrfFetch } from "./csrf";

const GET_USER_BOOKINGS = "bookings/getUserBookings";

export const getUserBookings = (bookings) => ({
  type: GET_USER_BOOKINGS,
  bookings,
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
    default:
      return state;
  }
};

export default bookingsReducer;
