import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/getReviewsForSpot";
const GET_USER_REVIEWS = "reviews/getReviewsForUser";
const CLEAR_STATE = "reviews/clearState";
const ADD_REVIEW = "reviews/addReview";
const DELETE_REVIEW = "reviews/deleteReview";

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

export const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
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

export const createNewReview = (spotId, review, stars) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ review, stars }),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(addReview(newReview));
    return newReview;
  }
};

export const deleteExistingReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    await res.json();
    dispatch(deleteReview(reviewId));
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
    case ADD_REVIEW: {
      const newState = { ...state };
      newState.spot[action.review.id] = action.review;
      return newState;
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState.spot[action.reviewId];
      return newState;
    }
    case CLEAR_STATE:
      return { ...initialState };
    default:
      return state;
  }
};

export default reviewsReducer;
