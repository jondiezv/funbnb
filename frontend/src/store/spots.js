import { csrfFetch } from "./csrf";

const GETALL_SPOTS = "spots/getSpots";
const CLEAR_STATE = "spots/clearState";
const GET_SPOT = "spots/getSpot";

export const getSpots = (spots) => ({
  type: GETALL_SPOTS,
  spots,
});

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const getSpot = (spot) => ({
  type: GET_SPOT,
  spot,
});

export const fetchAllSpots = () => async (dispatch) => {
  const res = await csrfFetch(`api/spots`);
  const spots = await res.json();
  dispatch(getSpots(spots));
};

export const fetchSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(getSpot(spot));
};

const initialState = { allSpots: {}, currentSpot: null };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETALL_SPOTS:
      const newState = { ...state };
      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      return newState;
    case CLEAR_STATE:
      return { ...initialState };
    case GET_SPOT:
      return {
        ...state,
        currentSpot: action.spot,
      };
    default:
      return state;
  }
};

export default spotsReducer;
