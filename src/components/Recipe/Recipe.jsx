import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/appContext";
import routes from "../../data/routes";

import styles from './Recipe.module.scss';

import StarToggle from "../StarToggle/StarToggle";

const Recipe = ({recipe}) => {
    const { favorites, setFavorites, setRecipe } = useContext(AppContext);
    const [ isToggled, setIsToggled ] = useState((favorites.includes(recipe)) ? (true) : (false));
    const navigate = useNavigate();
    
    const showInfo = () => {
        setRecipe(recipe);
        navigate(routes.info);
    }

    const starClick = (e) => {
        e.stopPropagation();
    }

    const onToggle = () => {
        setIsToggled(!isToggled);
        !isToggled ? 
            setFavorites([...favorites, recipe]) :
            setFavorites(favorites.filter((favorite) => favorite.id !== recipe.id)) 
        ;
    }

    return (
        <div className={styles.recipe} onClick={showInfo}>
            <h1>{recipe.title}</h1>
            <div className={styles.image}>
                <img src={recipe.image} alt="meal" className={styles.recipeImage} />
                <StarToggle isToggled={isToggled} onToggle={onToggle} starClick={starClick} recipe={recipe}/>
            </div>
        </div>
    )
}

export default Recipe;
