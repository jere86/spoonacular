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
            <button onClick={routeToSearch}>
                <svg viewBox="0 -50 588 588">
                    <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507 "></polygon>
                </svg>
            </button>
            <RecipesList recipesData={{results: favorites}}/>
        </div>
    )
}

export default Favorites;