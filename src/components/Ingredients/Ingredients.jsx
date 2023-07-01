import styles from "./Ingredients.module.scss";

const Ingredients = ({ ingredients, recipe }) => {
  return (
    <div className={styles.ingredients}>
      <h1>Ingredients</h1>
      {/* <div className={styles.ingredientsView}> */}
      <div className={styles.ingredientsList}>
        {ingredients.map((ingredient) => {
          return (
            <div className={styles.ingredient} key={ingredient.name}>
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
      {/* </div> */}
    </div>
  );
};

export default Ingredients;
