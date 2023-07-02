import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/appContext";

import "./Nutrition.css";
import styles from "./Info.module.scss";

import Instructions from "../../components/Instructions/Instructions";
import Ingredients from "../../components/Ingredients/Ingredients";
import Nutrition from "../../components/Nutrition/Nutrition";

import { getRequest } from "../../helpers/http";
// import { useParams } from "react-router-dom";

const Info = () => {
  // const { id } = useParams();
  const { recipe } = useContext(AppContext);
  const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const instructions = await getRequest(
        `/recipes/${recipe.id}/analyzedInstructions`
      );
      getAnalyzedInstructions(instructions[0].steps);

      const response = await getRequest(
        `/recipes/${recipe.id}/ingredientWidget.json`
      );
      setIngredients(response.ingredients);
    };

    getData();
  }, [recipe.id]);

  return (
    <div className={styles.info}>
      <h1 className={styles.name}>{recipe.title}</h1>
      <Ingredients ingredients={ingredients} recipe={recipe} />
      <Instructions instructions={analyzedInstructions} />
      <Nutrition recipe={recipe} />
    </div>
  );
};

export default Info;
