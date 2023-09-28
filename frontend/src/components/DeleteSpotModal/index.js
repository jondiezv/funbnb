import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteExistingSpot } from "../../store/spots";
import "./DeleteSpotModal.css";

const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteExistingSpot(spotId));
    setModalContent(null);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="modal-overlay">
      <div className="CreateReviewModal">
        <div className="confirm-d">Confirm Delete</div>
        <div className="confirm-delete">
          Are you sure you want to remove this spot
          <br />
          from the listings?
        </div>
        <button className="yes-delete" onClick={handleDelete}>
          Yes (Delete Spot)
        </button>
        <button className="no-keep" onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default DeleteSpotModal;
