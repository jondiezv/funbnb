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
import DeleteReviewModal from "../../DeleteReviewModal";
import { useModal } from "../../../context/Modal";
import CreateBookingModal from "../../BookSpotModal";

export const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { setModalContent } = useModal();

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

  const toggleBookingModal = () => {
    setShowBookingModal(!showBookingModal);
  };

  const openDeleteModal = (reviewId) => {
    setModalContent(
      <DeleteReviewModal
        reviewId={reviewId}
        onClose={() => setModalContent(null)}
        refreshReviews={refreshReviews}
      />
    );
  };
  const refreshReviews = () => {
    dispatch(fetchReviewsForSpot(spotId)).then(() => {
      dispatch(fetchSpot(spotId));
    });
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
      ? `★ ${avgRating} · ${spot.numReviews} ${reviewLabel}`
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
      <div className="spotName">{spot.name}</div>
      <div className="spotLoca">
        {spot.city}, {spot.state}, {spot.country}{" "}
      </div>
      <div className="imagesContainer">
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <>
            <div className="prevImage">
              <img src={spot.SpotImages[0].url} alt={`${spot.name} main`} />
            </div>
            <div className="smallImages">
              {spot.SpotImages.slice(1).map((image, index) => (
                <img
                  key={index}
                  className="smallImage"
                  src={image.url}
                  alt={`${spot.name} ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div>No images available</div>
        )}
      </div>
      <div className="bottomSection">
        <div className="descriptionBox">
          <div className="hostedBy">
            Hosted by{" "}
            {spot.Owner
              ? `${spot.Owner.firstName} ${spot.Owner.lastName}`
              : "Unknown"}
          </div>
          <div className="description">{spot.description}</div>
        </div>

        <div className="ratingBox">
          <div className="priceAndRating">
            <strong>${spot.price} night</strong>
            <div className="reviewSummary">{reviewSummary}</div>
          </div>
          <button onClick={toggleBookingModal}>Reserve</button>
        </div>
      </div>
      <div className="reviewSummary">{reviewSummary}</div>
      {showReviewButton && !isCurrentUserOwner && (
        <button className="reviewButton" onClick={toggleReviewModal}>
          Post Your Review
        </button>
      )}
      {showReviewModal && (
        <CreateReviewModal
          spotId={spotId}
          onClose={toggleReviewModal}
          refreshReviews={refreshReviews}
          setShowReviewModal={setShowReviewModal}
        />
      )}
      {showBookingModal && (
        <CreateBookingModal spotId={spotId} onClose={toggleBookingModal} />
      )}
      {reviews && reviews.length > 0 ? (
        <div className="reviews-container">
          {reviews.map((review) => {
            if (!review || !review.User) {
              return null;
            }
            return (
              <div key={review.id} className="review-item">
                <div className="reviewName">{review.User.firstName}</div>
                <div className="reviewDate">{formatDate(review.createdAt)}</div>
                <div className="reviewText">{review.review}</div>
                {currentUser && review.userId === currentUser.id && (
                  <button
                    className="deleteButton"
                    onClick={() => openDeleteModal(review.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : currentUser && spot.Owner && currentUser.id !== spot.Owner.id ? (
        <div className="no-reviews">Be the first to post a review!</div>
      ) : null}
    </div>
  );
};

export default SpotDetails;
