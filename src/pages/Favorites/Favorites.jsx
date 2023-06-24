import { useContext } from "react";
import { AppContext } from "../../context/appContext";

import RecipesList from "../../components/RecipesList/RecipesList";

import styles from './Favorites.module.scss';
import { useNavigate } from "react-router-dom";
import routes from "../../data/routes";

const Favorites = () => {
    const { favorites } = useContext(AppContext);
    const navigate = useNavigate();

    const routeToSearch = () => {
        navigate(routes.search);
    }

    return (
        <div className={styles.favorite}>
            <button onClick={routeToSearch}>back to Search</button>
            <RecipesList recipesData={{results: favorites}}/>
        </div>
    )
}

export default Favorites;