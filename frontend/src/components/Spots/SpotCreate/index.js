import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createNewSpot, addImageToSpot } from "../../../store/spots";
import "./SpotCreate.css";

export const SpotCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (description.length < 30) {
      validationErrors.description =
        "Description needs a minimum of 30 characters";
    }
    if (!name) {
      validationErrors.name = "Title is required";
    }
    if (!price) {
      validationErrors.price = "Price is required";
    }
    if (!country) {
      validationErrors.country = "Country is required";
    }
    if (!address) {
      validationErrors.address = "Address is required";
    }
    if (!city) {
      validationErrors.city = "City is required";
    }
    if (!state) {
      validationErrors.state = "State is required";
    }
    if (!lat) {
      validationErrors.lat = "Latitude is required";
    }
    if (!lng) {
      validationErrors.lng = "Longitude is required";
    }
    if (!imageUrls[0]) {
      validationErrors.imageUrls = "Preview image is required";
    }
    if (imageUrls.some((url) => url && !url.match(/\.(jpeg|jpg|png)$/))) {
      validationErrors.imageUrls = "Image URL must end in .png, .jpg, or .jpeg";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const newSpot = await dispatch(
        createNewSpot({
          name,
          description,
          country,
          address,
          city,
          state,
          price,
          lat,
          lng,
        })
      );

      if (newSpot) {
        let isFirstImage = true;
        for (let imageUrl of imageUrls.filter((url) => url)) {
          await dispatch(addImageToSpot(newSpot.id, imageUrl, isFirstImage));
          isFirstImage = false;
        }

        history.push(`/spots/${newSpot.id}`);
      }
    } catch (error) {
      console.error("There was an error:", error);
      setErrors({
        ...errors,
        general: "An error occurred while creating the spot.",
      });
    }
  };

  return (
    <div className="SpotCreate-container">
      <h1>Create a New Spot</h1>
      {errors.general && <p>{errors.general}</p>}
      <form className="SpotCreate-form" onSubmit={handleSubmit}>
        <h2>Where's your place located?</h2>
        <h3>
          Guests will only get your exact address once they booked a
          reservation.
        </h3>

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
        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        <input
          type="text"
          placeholder="Preview image URL"
          value={imageUrls[0]}
          onChange={(e) => {
            const newUrls = [...imageUrls];
            newUrls[0] = e.target.value;
            setImageUrls(newUrls);
          }}
        />
        {errors.imageUrls && (
          <span className="error-message">{errors.imageUrls}</span>
        )}
        {[1, 2, 3, 4].map((idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Image URL`}
            value={imageUrls[idx]}
            onChange={(e) => {
              const newUrls = [...imageUrls];
              newUrls[idx] = e.target.value;
              setImageUrls(newUrls);
            }}
          />
        ))}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default SpotCreate;
