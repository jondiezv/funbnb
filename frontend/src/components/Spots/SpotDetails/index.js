import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../../store/spots";

export const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.currentSpot);

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot) return null;

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(2) : "New";
  const reviewLabel = spot.numReviews === 1 ? "Review" : "Reviews";
  const reviewSummary =
    spot.numReviews > 0
      ? `★ ${avgRating} · (${spot.numReviews} ${reviewLabel})`
      : `★ ${avgRating}`;

  return (
    <div>
      <h1>{spot.name}</h1>
      <div className="reviewSummary">{reviewSummary}</div>
      <div>
        Location: {spot.city}, {spot.state}, {spot.country}
      </div>
      <div>
        Images:
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <div>
            <img src={spot.SpotImages[0].url} alt={`${spot.name} main`} />
            {spot.SpotImages.slice(1).map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${spot.name} ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <div>No images available</div>
        )}
      </div>
      <div>
        Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}
      </div>
      <div>{spot.description}</div>
      <div>
        <strong>{spot.price} night</strong>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>
      <h2>Reviews</h2>
      <div className="reviewSummary">{reviewSummary}</div>
    </div>
  );
};

export default SpotDetails;
