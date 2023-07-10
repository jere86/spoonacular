import { useContext } from "react";
import { AppContext } from "../../context/appContext";

import RecipesList from "../../components/RecipesList/RecipesList";

import styles from "./Favorites.module.scss";

const Favorites = () => {
  const { getCurrentUserFavorites } = useContext(AppContext);
  return (
    <div className={styles.favorite}>
      <RecipesList recipesData={{ results: getCurrentUserFavorites() }} />
    </div>
  );
};

export default Favorites;
