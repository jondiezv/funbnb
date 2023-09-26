import { csrfFetch } from "./csrf";

const GETALL_SPOTS = "spots/getSpots";
const CLEAR_STATE = "spots/clearState";
const GET_SPOT = "spots/getSpot";
const CREATE_SPOT = "spots/createSpot";

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

export const createSpot = (spot) => ({
  type: CREATE_SPOT,
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

export const createNewSpot =
  (newSpotData, imageUrl, preview) => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSpotData),
    });

    if (res.ok) {
      const newSpot = await res.json();
      dispatch(createSpot(newSpot));

      if (imageUrl) {
        const imageResponse = await dispatch(
          addImageToSpot(newSpot.id, imageUrl, preview)
        );
        if (imageResponse.id) {
        }
      }

      return newSpot;
    }
  };

export const addImageToSpot = (spotId, url, preview) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, preview }),
  });

  if (res.ok) {
    const newImage = await res.json();
    return newImage;
  } else {
    const errors = await res.json();
    return errors;
  }
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
    case CREATE_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
        currentSpot: action.spot,
      };
    default:
      return state;
  }
};

export default spotsReducer;
