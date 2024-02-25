import { v4 } from "uuid";
import styles from "./Ingredients.module.scss";

const Ingredients = ({ ingredients }) => {
  return (
    <div className={styles.ingredients}>
      <h2>Ingredients</h2>
      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient) => {
          return (
            <div className={styles.ingredient} key={v4()}>
              <p>{ingredient.name}</p>
              <img
                src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                alt="ingredient"
                id="ingredient-image"
              />
              <p>
                {ingredient.amount.metric.value} {ingredient.amount.metric.unit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ingredients;
