import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllSpots } from "../../../store/spots";
import "./SpotsIndex.css";

const SpotsIndex = () => {
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
        <Link to={`/spots/${spot.id}`} key={spot.id}>
          <div className="spotCard">
            <img
              src={spot.previewImage}
              alt="Spot thumbnail"
              className="spotImage"
            />
            <div>
              {spot.city}, {spot.state}
            </div>
            <div title={spot.name}>
              {spot.name}
              <span className="avgRating">
                ★ {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
              </span>
            </div>
            <div>{spot.price} night</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SpotsIndex;
