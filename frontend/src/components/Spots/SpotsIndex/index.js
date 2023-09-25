import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSpots } from "../../../store/spots";
import "./SpotsIndex.css";

export const SpotsIndex = () => {
  const dispatch = useDispatch();

  const spots = useSelector((state) =>
    Object.values(state.spots?.allSpots || {})
  );

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  return (
    <div>
      {spots.map((spot) => (
        <div key={spot.id} className="spotCard">
          <img
            src={spot.previewImage}
            alt="Spot thumbnail"
            className="spotImage"
          />
          <div>
            {spot.city}, {spot.state}
          </div>
          <div title={spot.name}>{spot.name}</div>
          <div>{spot.avgRating ? spot.avgRating.toFixed(2) : "New"}</div>
          <div>{spot.price} night</div>
        </div>
      ))}
    </div>
  );
};

export default SpotsIndex;
