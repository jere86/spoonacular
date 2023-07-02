import {
  Link,
  Route,
  Routes,
  useMatch,
  useResolvedPath,
} from "react-router-dom";

import styles from "./App.module.scss";

import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Info from "./pages/Info/Info";
import Favorites from "./pages/Favorites/Favorites";

export default function App() {
  return (
    <>
      <nav className={styles.navbar}>
        <Link to="/">Home</Link>
        <ul>
          <CustomLink to="/search">Search</CustomLink>
          <CustomLink to="/favorites">Favorites</CustomLink>
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

  function CustomLink({ to, children, ...props }) {
    const resolvePath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvePath.pathname });
    return (
      <li className={isActive ? `${styles.active}` : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  }
}
