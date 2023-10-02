import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isSignUpDisabled =
    email === "" ||
    firstName === "" ||
    lastName === "" ||
    username === "" ||
    password === "" ||
    username.length < 4 ||
    password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSignUpDisabled) {
      setErrors({});
      if (password !== confirmPassword) {
        setErrors({
          confirmPassword: "Please ensure password and confirm password match",
        });
        return;
      }
      dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
  };

  return (
    <>
      <div className="signup">Sign Up</div>
      <form onSubmit={handleSubmit}>
        <div>First Name</div>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p>{errors.firstName}</p>}
        <div>Last Name</div>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p>{errors.lastName}</p>}
        <div>Email</div>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p>{errors.email}</p>}
        <div>Username</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p>{errors.username}</p>}
        <div>Password</div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p>{errors.password}</p>}
        <div>Confirm Password</div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" disabled={isSignUpDisabled}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
