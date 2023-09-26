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
  const [errors, setErrors] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors([]);

    if (description.length < 30) {
      setErrors([...errors, "Please write at least 30 characters"]);
    }
    if (!name) {
      setErrors([...errors, "Name is required"]);
    }
    if (!price) {
      setErrors([...errors, "Price is required"]);
    }
    if (!imageUrls[0]) {
      setErrors([...errors, "Preview image is required"]);
    }
    if (imageUrls.some((url) => url && !url.match(/\.(jpeg|jpg|png)$/))) {
      setErrors([...errors, "Image URL must end in .png, .jpg, or .jpeg"]);
    }

    if (errors.length > 0) {
      return;
    }

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
  };
  return (
    <div>
      <h1>Create a New Spot</h1>
      {errors.map((error, idx) => (
        <p key={idx}>{error}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <h2>Where's your place located?</h2>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />

        <h2>Describe your place to guests</h2>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h2>Create a title for your spot</h2>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <h2>Set a base price for your spot</h2>
        <div>
          <span>$</span>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <h2>Liven up your spot with photos</h2>
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
        {[1, 2, 3, 4].map((idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Image URL #${idx + 1} (Optional)`}
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
