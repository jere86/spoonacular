import { useContext } from "react";
import { AppContext } from "../../context/appContext";

import RecipesList from "../../components/RecipesList/RecipesList";

import styles from "./Favorites.module.scss";

const Favorites = () => {
  const { favorites } = useContext(AppContext);
  return (
    <div className={styles.favorite}>
      <RecipesList recipesData={{ results: favorites }} />
    </div>
  );
};

export default Favorites;
