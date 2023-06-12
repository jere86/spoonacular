import { useEffect, useState } from "react";
import { getRequest } from "../../helpers/http";

import styles from './Recipe.module.scss'

const Recipe = ({recipe}) => {
    const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const getData = async () => {

            const instructions = await getRequest(`/recipes/${recipe.id}/analyzedInstructions?apiKey=e1f556e241884f5e8493a5f17cb629bd`);
            getAnalyzedInstructions(instructions[0].steps);

            const response = await getRequest(`/recipes/${recipe.id}/ingredientWidget.json?apiKey=e1f556e241884f5e8493a5f17cb629bd`);
            setIngredients(response.ingredients);
        }
            
        getData();
    }, [recipe.id]);

    const instuctions = analyzedInstructions.map(({step}) => step).join(" ");

    return (
        <div className={styles.recipe}>
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="meal" className={styles.recipeImage} />
            <div className={styles.instuctions}>{instuctions}</div>
            <div className={styles.ingredients}>
                {ingredients.map((ingredient) => {
                    return (
                        <div className={styles.ingredient} key={ingredient.name}>
                            <p>{ingredient.name}</p>
                            <img src={ingredient.image} alt="ingredient" id="ingredient-image" />
                            <p>{ingredient.amount.metric.value} {ingredient.amount.metric.unit}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Recipe;
