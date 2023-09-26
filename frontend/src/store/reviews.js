import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/getReviewsForSpot";
const GET_USER_REVIEWS = "reviews/getReviewsForUser";
const CLEAR_STATE = "reviews/clearState";

export const getReviewsForSpot = (spotId, reviews) => ({
  type: GET_REVIEWS,
  spotId,
  reviews,
});

export const getReviewsForUser = (reviews) => ({
  type: GET_USER_REVIEWS,
  reviews,
});

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const fetchReviewsForSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (res.ok) {
      const { Reviews } = await res.json();
      dispatch(getReviewsForSpot(spotId, Reviews));
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
};

export const fetchReviewsForCurrentUser = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/reviews/current");
    if (res.ok) {
      const { Reviews } = await res.json();
      dispatch(getReviewsForUser(Reviews));
    }
  } catch (err) {
    console.error("Error fetching user reviews:", err);
  }
};

const initialState = {
  spot: {},
  user: {},
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS: {
      const newState = { ...state };
      newState.spot = {};
      action.reviews.forEach((review) => {
        newState.spot[review.id] = review;
      });
      return newState;
    }
    case GET_USER_REVIEWS: {
      const newState = { ...state };
      newState.user = {};
      action.reviews.forEach((review) => {
        newState.user[review.id] = review;
      });
      return newState;
    }
    case CLEAR_STATE:
      return { ...initialState };
    default:
      return state;
  }
};

export default reviewsReducer;
