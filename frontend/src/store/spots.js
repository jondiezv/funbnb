import { csrfFetch } from "./csrf";

const GETALL_SPOTS = "spots/getSpots";
const CLEAR_STATE = "spots/clearState";

export const getSpots = (spots) => ({
  type: GETALL_SPOTS,
  spots,
});

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const fetchAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const spots = await res.json();
  dispatch(getSpots(spots));
};

const initialState = { allSpots: {} };

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
    default:
      return state;
  }
};

export default spotsReducer;
