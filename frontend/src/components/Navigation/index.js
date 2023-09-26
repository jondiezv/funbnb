import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar-ul">
      <li className="navbar-li">
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {sessionUser && (
        <li className="navbar-li">
          <NavLink to="/new-spot">Create a New Spot</NavLink>
        </li>
      )}
      {isLoaded && (
        <li className="navbar-li">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
