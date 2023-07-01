import { v4 as uuidv4 } from "uuid";

import styles from "./Instructions.module.scss";

const Instructions = ({ instructions }) => {
  return (
    <div className={styles.instuctions}>
      <h1>Instructions</h1>
      <ul className={styles.instructionsList}>
        {instructions.map(({ step, ingredients, equipment, number }) => {
          return (
            <li key={number} className={styles.instructionsListItem}>
              <p>
                {number}. {step}
              </p>
              {ingredients.length !== 0 && (
                <div className={styles.ingredients}>
                  <p>Ingredients</p>
                  <ul>
                    {ingredients.map(({ name, image }) => {
                      return (
                        <li key={uuidv4()}>
                          <p>{name}</p>
                          <img
                            src={`https://spoonacular.com/cdn/ingredients_100x100/${image}`}
                            alt="ingredient"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {equipment.length !== 0 && (
                <div className={styles.equipment}>
                  <p>Equipment</p>
                  <ul>
                    {equipment.map(({ name, image }) => {
                      return (
                        <li key={uuidv4()}>
                          <p>{name}</p>
                          <img
                            src={`https://spoonacular.com/cdn/equipment_100x100/${image}`}
                            alt="equipment"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Instructions;
