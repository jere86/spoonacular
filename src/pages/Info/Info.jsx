import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/appContext";

import styles from './Info.module.scss';

import Instructions from '../../components/Instructions/Instructions';
import Ingredients from '../../components/Ingredients/Ingredients';

import { getRequest } from "../../helpers/http";

const Info = () => {
    const { recipe } = useContext(AppContext);

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
        <div className={styles.info}>
            <h1 className={styles.name}>{recipe.title}</h1>
            <Instructions instructions={analyzedInstructions}/>
            <Ingredients ingredients={ingredients}/>
        </div>
    )
}

export default Info;