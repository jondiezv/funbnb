import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewReview } from "../../store/reviews";
import "./CreateReviewModal.css";

const StarRating = ({ stars, setStars }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(starValue)}
            className={`star ${starValue <= (hover || stars) ? "active" : ""}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const CreateReviewModal = ({ spotId, refreshReviews, setShowReviewModal }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    try {
      await dispatch(createNewReview(spotId, review, stars));
      setShowReviewModal(false);
      refreshReviews();
    } catch (error) {
      setErrors("An error occurred while submitting the review.");
    }
  };

  const closeOnOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowReviewModal(false);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const isDisabled = review.length < 10 || stars === 0;

  return (
    <div className="modal-overlay" onClick={closeOnOverlayClick}>
      <div className="CreateReviewModal" onClick={stopPropagation}>
        <h2>How was your stay?</h2>
        {errors && <div className="errors">{errors}</div>}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <div>
            <label>Stars:</label>
            <StarRating stars={stars} setStars={setStars} />
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className={isDisabled ? "disabled-button" : ""}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewModal;
