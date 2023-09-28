import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserSpots } from "../../../store/spots";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpotModal from "../../DeleteSpotModal";

const SpotsUserIndex = () => {
  const dispatch = useDispatch();
  const userSpots = useSelector((state) => state.spots.userSpots);

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  return (
    <div>
      <h1>Manage Spots</h1>
      <Link to="/new-spot">
        <button>Create a New Spot</button>
      </Link>
      {userSpots.length > 0 &&
        userSpots.map((spot) => (
          <div key={spot.id} className="spotCard">
            <Link to={`/spots/${spot.id}`}>
              <img
                src={spot.previewImage}
                alt="Spot thumbnail"
                className="spotImage"
              />
            </Link>
            <div>
              {spot.city}, {spot.state}
            </div>
            <div>
              <Link to={`/spots/${spot.id}/edit`}>
                <button>Update</button>
              </Link>
              <OpenModalButton
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                buttonText="Delete"
              />
            </div>
            <div title={spot.name}>
              {spot.name}
              <span className="avgRating">
                ★ {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
              </span>
            </div>
            <div>{spot.price} night</div>
          </div>
        ))}
    </div>
  );
};

export default SpotsUserIndex;
