import { useEffect, useState } from "react";
import { getRequest } from '../../helpers/http';

import styles from "./Nutrition.module.scss"

const Nutrition = ({recipe}) => {
    const [nutritionData, setNutritionData] = useState();
    const [optionalNutrition, setOptionalNutrition] = useState(false);

    useEffect(() => {
        const getNutritionData = async () => {
            const nutrition = await getRequest(`recipes/${recipe.id}/nutritionLabel`, {
                defaultCss: false,
                showOptionalNutrients: optionalNutrition
            });
        
            setNutritionData(nutrition);
        }
    
        getNutritionData();
    }, [recipe.id, optionalNutrition]);

    const optionalNutrientToggle = () => {
        setOptionalNutrition(!optionalNutrition);

        const getNutritionData = async () => {
            const nutrition = await getRequest(`recipes/${recipe.id}/nutritionLabel`, {
                defaultCss: false,
                showOptionalNutrients: true
            });
        
            setNutritionData(nutrition);
        }
    
        getNutritionData();
    }

    return (
        <div className={styles.nutrition}>
            <button onClick={optionalNutrientToggle}>Optional Nutrients</button>
            <div dangerouslySetInnerHTML={{__html: nutritionData}} />
        </div>
    )
}

export default Nutrition;