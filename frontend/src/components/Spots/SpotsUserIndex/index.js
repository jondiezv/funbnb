import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserSpots } from "../../../store/spots";

const SpotsUserIndex = () => {
  const dispatch = useDispatch();
  const userSpots = useSelector((state) => state.spots.userSpots);

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  return (
    <div>
      {userSpots.map((spot) => (
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

export default SpotsUserIndex;
