import { NavLink, useNavigate } from "react-router-dom";
import { v4 } from "uuid";

import styles from "./Navbar.module.scss";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { username, setUsername, setEmail, setLoggedIn } =
    useContext(AppContext);

  function handleLogout() {
    setLoggedIn(false);
    setUsername("");
    setEmail("");
    navigate("/");
  }

  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        HOME
      </NavLink>

      <ul>
        <li key={v4()}>
          <NavLink
            to="/mealplanner"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            MEAL PLANNER
          </NavLink>
        </li>
        <li key={v4()}>
          <NavLink
            to="/shopinglist"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            SHOPING LIST
          </NavLink>
        </li>
        <li key={v4()}>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            SEARCH RECIPES
          </NavLink>
        </li>
        <li key={v4()}>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            FAVORITES
          </NavLink>
        </li>
        <li key={v4()}>
          <NavLink
            to="/community"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            COMMUNITY
          </NavLink>
        </li>
      </ul>
      <div>
        <p>Welcome, {username.toUpperCase()}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
