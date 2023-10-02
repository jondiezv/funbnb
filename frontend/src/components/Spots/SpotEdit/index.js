import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { updateExistingSpot, fetchSpot } from "../../../store/spots";
import "./SpotEdit.css";

const SpotEdit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.currentSpot);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSpot(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setName(spot.name || "");
      setDescription(spot.description);
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setPrice(spot.price);
      setLat(spot.lat);
      setLng(spot.lng);
    }
  }, [spot]);

  const validate = () => {
    const validationErrors = {};
    if (description.length < 30) {
      validationErrors.description =
        "Description needs a minimum of 30 characters";
    }
    if (!name) validationErrors.name = "Title is required.";
    if (!description) validationErrors.description = "Description is required.";
    if (!price) validationErrors.price = "Price is required.";
    if (!country) validationErrors.country = "Country is required.";
    if (!address) validationErrors.address = "Address is required.";
    if (!city) validationErrors.city = "City is required.";
    if (!state) validationErrors.state = "State is required.";
    if (!lat) validationErrors.lat = "Latitude is required.";
    if (!lng) validationErrors.lng = "Longitude is required.";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        name,
        description,
        price,
        country,
        address,
        city,
        state,
        lat,
        lng,
      };

      const updatedSpot = await dispatch(updateExistingSpot(spotId, payload));

      if (updatedSpot) {
        history.push(`/spots/${spotId}`);
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: "An error occurred while updating the spot.",
      });
    }
  };

  return (
    <div className="SpotEdit-container">
      <div className="UYS">Update your Spot</div>
      {errors.general && <p>{errors.general}</p>}
      <form className="SpotEdit-form" onSubmit={handleSubmit}>
        <h2>Where's your place located?</h2>
        <h3>
          Guests will only get your exact address once they booked a
          reservation.
        </h3>
        <div>
          <div>Country</div>
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {errors.country && (
            <span className="error-message">{errors.country}</span>
          )}
        </div>
        <div>
          <div>Street Address</div>
          <input
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
        </div>
        <div className="cityState">
          <div className="cityInput">
            <div>City</div>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (
              <span className="error-message">{errors.city}</span>
            )}
          </div>
          <div>
            <div>State</div>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {errors.state && (
              <span className="error-message">{errors.state}</span>
            )}
          </div>
        </div>
        <div className="latLng">
          <div className="latInput">
            <div>Latitude</div>
            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            {errors.lat && <span className="error-message">{errors.lat}</span>}
          </div>
          <div>
            <div>Longitude</div>
            <input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            {errors.lng && <span className="error-message">{errors.lng}</span>}
          </div>
        </div>
        <h2>Describe your place to guests</h2>
        <h3>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
        <h2>Create a title for your spot</h2>
        <h3>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </h3>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results
        </h3>
        <div>
          <span>$</span>
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors.price && <span className="error-message">{errors.price}</span>}
        <button type="submit">Update Spot</button>
      </form>
    </div>
  );
};

export default SpotEdit;
