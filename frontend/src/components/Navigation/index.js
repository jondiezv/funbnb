import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar-ul">
      <li>
        <NavLink exact to="/">
          <img
            src="https://cdn.discordapp.com/attachments/1155927455580823562/1157052503423197334/Untitled-3.png"
            alt="Home Logo"
            className="home-logo"
          />
        </NavLink>
      </li>

      {sessionUser && (
        <NavLink className="create-spot" to="/new-spot">
          Create a New Spot
        </NavLink>
      )}
      {isLoaded && (
        <li className="profile-button">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
