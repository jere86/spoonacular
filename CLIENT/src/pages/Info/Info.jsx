import { useEffect, useState } from "react";

import "./Nutrition.css";
import styles from "./Info.module.scss";

import Instructions from "../../components/Instructions/Instructions";
import Ingredients from "../../components/Ingredients/Ingredients";
import Nutrition from "../../components/Nutrition/Nutrition";

import { getRequest } from "../../helpers/http";
import { useParams } from "react-router-dom";

const Info = () => {
  const { id } = useParams();
  const [analyzedInstructions, setAnalyzedInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState();

  useEffect(() => {
    const getData = async () => {
      const recipeInfo = await getRequest(`/recipes/${id}/information`);
      setRecipe(recipeInfo);

      const instructions = await getRequest(
        `/recipes/${id}/analyzedInstructions`
      );
      setAnalyzedInstructions(instructions[0].steps);

      const response = await getRequest(`/recipes/${id}/ingredientWidget.json`);
      setIngredients(response.ingredients);
    };

    getData();
  }, [id]);

  return (
    <div className={styles.info}>
      {recipe !== undefined && (
        <h1
          className={styles.name}
          style={{ backgroundImage: `url(${recipe.image})` }}
        >
          <span>{recipe.title.toUpperCase()}</span>
        </h1>
      )}
      <Ingredients ingredients={ingredients} />
      <Instructions instructions={analyzedInstructions} />
      {recipe !== undefined && <Nutrition recipe={recipe} />}
    </div>
  );
};

export default Info;
