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
    <div className="spotsContainer">
      {spots.map((spot) => (
        <Link to={`/spots/${spot.id}`} key={spot.id} className="spotLink">
          <div className="spotCard" title={spot.name}>
            <img
              src={spot.previewImage}
              alt="Spot thumbnail"
              className="spotImage"
            />
            <div className="spotInfo">
              <span className="spotLocation">
                {spot.city}, {spot.state}
              </span>
              <span className="avgRating">
                <span className="starIcon">★</span>
                {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
              </span>
            </div>
            <div className="spotPrice">${spot.price} night</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SpotsIndex;
