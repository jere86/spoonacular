import axios from "axios";
import { useEffect, useState } from "react";

export default function Recipe({recipe}) {
    const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
    const [ingredients, getIngredients] = useState([]);

    useEffect(() => {
        axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=e1f556e241884f5e8493a5f17cb629bd`)
        .then(res => {
            getAnalyzedInstructions(res.data[0].steps);
        })
        .catch(err => {
            console.log(err.toJSON());
        });

        axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json?apiKey=e1f556e241884f5e8493a5f17cb629bd`)
        .then(res => {
            getIngredients(res.data.ingredients);
            console.log(res.data)
        })
        .catch(err => {
            console.log(err.toJSON());
        });

    }, [recipe.id]);

    const instuctions = analyzedInstructions.map(({step}) => step).join(" ");

    return (
        <div className="recipe">
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="meal" id="recipe-image" />
            <div className="instuctions">{instuctions}</div>
            <div className="ingredients">
                {ingredients.map((ingredient) => {
                    return (
                        <div className="ingredient">
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