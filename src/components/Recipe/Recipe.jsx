import { useEffect, useState } from "react";

import styles from './Recipe.module.scss';

import Instructions from "../Instructions/Instructions";
import Ingredients from "../Ingredients/Ingredients";

import { getRequest } from "../../helpers/http";

const Recipe = ({recipe}) => {
    const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const getData = async () => {

            const instructions = await getRequest(`/recipes/${recipe.id}/analyzedInstructions`);
            getAnalyzedInstructions(instructions[0].steps);

            const response = await getRequest(`/recipes/${recipe.id}/ingredientWidget.json`);
            setIngredients(response.ingredients);
        }
            
        getData();
    }, [recipe.id]);

    return (
        <div className={styles.recipe}>
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="meal" className={styles.recipeImage} />
            <Instructions instructions={analyzedInstructions} />
            <Ingredients ingredients={ingredients}/>
        </div>
    )
}

export default Recipe;
