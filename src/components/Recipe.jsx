import axios from "axios";
import { useEffect, useState } from "react";

export default function Recipe({recipe}) {
    const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
    const [ingredientWidget, getIngredientWidget] = useState(null);

    useEffect(() => {
        axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=e1f556e241884f5e8493a5f17cb629bd`)
        .then(res => {
            getAnalyzedInstructions(res.data[0].steps);
        })
        .catch(err => {
            console.log(err.toJSON());
        });

        axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget?apiKey=e1f556e241884f5e8493a5f17cb629bd&measure=metric`)
        .then(res => {
            getIngredientWidget(<div>{res.data}</div>);
        })
        .catch(err => {
            console.log(err.toJSON());
        });

    }, [recipe.id]);

    const instuctions = analyzedInstructions.map(({step}) => step).join(" ");

    return (
        <div className="recipe">
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="meal" />
            <div className="instuctions">{instuctions}</div>
            {ingredientWidget}
        </div>
    )
}