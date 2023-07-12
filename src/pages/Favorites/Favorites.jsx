import { useContext } from "react";
import { AppContext } from "../../context/appContext";

import RecipesList from "../../components/RecipesList/RecipesList";

import styles from "./Favorites.module.scss";

const Favorites = () => {
  const { currentUser } = useContext(AppContext);

  return (
    <div className={styles.favorite}>
      {currentUser.favorites && (
        <RecipesList recipesData={{ results: currentUser.favorites }} />
      )}
    </div>
  );
};

export default Favorites;
