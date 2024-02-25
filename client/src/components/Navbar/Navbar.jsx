import { useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import { IconContext } from "react-icons";
import { FaBars, FaTimes } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const navRef = useRef();
  const navigate = useNavigate();
  const { username, setUsername, setEmail, setLoggedIn } =
    useContext(AppContext);

  function handleLogout() {
    setLoggedIn(false);
    setUsername("");
    setEmail("");
    navigate("/");
  }

  const showNavbar = () => {
    if (window.innerWidth <= 768) {
      navRef.current.classList.toggle(`${styles.responsive}`);
    }
  };

  return (
    <header>
      <button onClick={showNavbar} className={styles.nav_btn}>
        <IconContext.Provider value={{ className: `${styles.bars}` }}>
          <FaBars />
        </IconContext.Provider>
      </button>
      <NavLink to="/home" className={styles.logo}>
        <img
          src="http://spoonacular.com/application/frontend/images/logo-simple-framed-green-gradient.svg"
          alt="spoonacular logo"
        />
      </NavLink>
      <nav ref={navRef}>
        <NavLink
          onClick={showNavbar}
          to="/mealplanner"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          MEAL PLANNER
        </NavLink>
        <NavLink
          onClick={showNavbar}
          to="/shopinglist"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          SHOPING LIST
        </NavLink>
        <NavLink
          onClick={showNavbar}
          to="/search"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          SEARCH RECIPES
        </NavLink>
        <NavLink
          onClick={showNavbar}
          to="/favorites"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          FAVORITES
        </NavLink>
        <NavLink
          onClick={showNavbar}
          to="/community"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          COMMUNITY
        </NavLink>
        <button
          onClick={showNavbar}
          className={`${styles.nav_btn} ${styles.nav_close_btn}`}
        >
          <IconContext.Provider value={{ className: `${styles.times}` }}>
            <FaTimes />
          </IconContext.Provider>
        </button>
      </nav>
      <span>
        <p>Welcome, {username.toUpperCase()}!</p>
        <button onClick={handleLogout} className={styles.logout}>
          <IconContext.Provider value={{ className: `${styles.btn}` }}>
            <GrLogout />
          </IconContext.Provider>
        </button>
      </span>
    </header>
  );
};

export default Navbar;
