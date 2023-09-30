import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteExistingReview } from "../../store/reviews";
import "./DeleteReviewModal.css";

const DeleteReviewModal = ({ reviewId, refreshReviews }) => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteExistingReview(reviewId));
    setModalContent(null);
    refreshReviews();
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="modal-overlay">
      <div className="CreateReviewModal">
        <div className="confirm-d">Confirm Delete</div>
        <div className="confirm-delete">
          Are you sure you want to delete this review?
        </div>
        <button className="yes-delete" onClick={handleDelete}>
          Yes (Delete Review)
        </button>
        <button className="no-keep" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
