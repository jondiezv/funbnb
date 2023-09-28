import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../../store/spots";
import {
  fetchReviewsForSpot,
  fetchReviewsForCurrentUser,
} from "../../../store/reviews";
import "./SpotDetails.css";
import OpenModalButton from "../../OpenModalButton";
import CreateReviewModal from "../../CreateReviewModal";

export const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {}, [showReviewModal]);

  const spot = useSelector((state) => state.spots.currentSpot);
  const reviews = useSelector((state) =>
    Object.values(state.reviews.spot).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  );
  const currentUser = useSelector((state) => state.session.user);

  const toggleReviewModal = () => {
    setShowReviewModal(!showReviewModal);
  };

  const refreshReviews = () => {
    dispatch(fetchReviewsForSpot(spotId));
  };

  useEffect(() => {
    dispatch(fetchSpot(spotId));
    dispatch(fetchReviewsForSpot(spotId));
    dispatch(fetchReviewsForCurrentUser());
  }, [dispatch, spotId]);

  useEffect(() => {
    if (reviews && currentUser) {
      const hasUserReviewed = reviews.some(
        (review) => review.userId === currentUser.id
      );
      setShowReviewButton(!hasUserReviewed);
    }
  }, [reviews, currentUser]);

  if (!spot) return null;

  const avgRating = spot.avgRating ? spot.avgRating.toFixed(1) : "New";
  const reviewLabel = spot.numReviews === 1 ? "Review" : "Reviews";
  const reviewSummary =
    spot.numReviews > 0
      ? `★ ${avgRating} · (${spot.numReviews} ${reviewLabel})`
      : `★ ${avgRating}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const isCurrentUserOwner =
    currentUser && spot.Owner && currentUser.id === spot.Owner.id;

  return (
    <div className="SpotDetails-container">
      <h1>{spot.name}</h1>
      <div>
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div>
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
        Hosted by{" "}
        {spot.Owner
          ? `${spot.Owner.firstName}, ${spot.Owner.lastName}`
          : "Unknown"}
      </div>
      <div>{spot.description}</div>
      <div>
        <strong>${spot.price} night</strong>
        <div className="reviewSummary">{reviewSummary}</div>
        <button onClick={() => alert("Feature coming soon")}>Reserve</button>
      </div>
      <h2>Reviews</h2>
      <div className="reviewSummary">{reviewSummary}</div>

      {showReviewButton && !isCurrentUserOwner && (
        <button onClick={toggleReviewModal}>Post Your Review</button>
      )}

      {showReviewModal && (
        <CreateReviewModal
          spotId={spotId}
          onClose={toggleReviewModal}
          refreshReviews={refreshReviews}
          setShowReviewModal={setShowReviewModal}
        />
      )}

      {reviews && reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => {
            if (!review || !review.User) {
              return null;
            }
            return (
              <li key={review.id}>
                <div>{review.User.firstName}</div>
                <div>{formatDate(review.createdAt)}</div>
                <div>{review.review}</div>
              </li>
            );
          })}
        </ul>
      ) : currentUser && spot.Owner && currentUser.id !== spot.Owner.id ? (
        <div>Be the first to post a review!</div>
      ) : null}
    </div>
  );
};

export default SpotDetails;
