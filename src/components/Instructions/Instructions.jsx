import { v4 as uuidv4 } from 'uuid';

import styles from "./Instructions.module.scss";

const Instructions = ({instructions}) => {

    return (
        <div className={styles.instuctions}>
            <h1>Instructions</h1>
            <ol className={styles.instructionsList}>
                {instructions.map(({ step, ingredients, equipment, number }) => {
                    return (
                        <li key={number} style={styles.instructionsListItem}>
                            <p>{step}</p>
                            {ingredients && (
                                <ul>
                                    {ingredients.map(({ name, image }) => {
                                        return (
                                            <li key={uuidv4()}>
                                                <p>{name}</p>
                                                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${image}`} alt="ingredient" />
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                            {equipment && (
                                <ul>
                                    {equipment.map(({ name, image }) => {
                                        return (
                                            <li key={uuidv4()}>
                                                <p>{name}</p>
                                                <img src={`https://spoonacular.com/cdn/equipment_100x100/${image}`} alt="equipment" />
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

export default Instructions;
