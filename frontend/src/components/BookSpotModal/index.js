import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewBooking } from "../../store/bookings";
import "./BookSpotModal.css";

const CreateBookingModal = ({ spotId, onClose, refreshBookings }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      await dispatch(createNewBooking(spotId, startDate, endDate));
      onClose();
      refreshBookings();
    } catch (error) {
      setErrors("An error occurred while creating the booking.");
    }
  };

  const isDisabled = startDate === "" || endDate === "";

  return (
    <div className="modal-overlay">
      <div className="CreateBookingModal">
        <h2>Book this spot</h2>
        {errors && <div className="errors">{errors}</div>}
        <form onSubmit={handleSubmit}>
          <div className="date-picker">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-picker">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className={isDisabled ? "disabled-button" : ""}
          >
            Reserve
          </button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;
