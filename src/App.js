import { NavLink, Route, Routes } from "react-router-dom";

import styles from "./App.module.scss";

import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Info from "./pages/Info/Info";
import Favorites from "./pages/Favorites/Favorites";

export default function App() {
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          HOME
        </NavLink>
        <ul>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            SEARCH
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            FAVORITES
          </NavLink>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info/:id" element={<Info />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
}
