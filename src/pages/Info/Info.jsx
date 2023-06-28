import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/appContext";

import "./Nutrition.css";
import styles from './Info.module.scss';

import Instructions from '../../components/Instructions/Instructions';
import Ingredients from '../../components/Ingredients/Ingredients';
import Nutrition from '../../components/Nutrition/Nutrition';

import { getRequest } from "../../helpers/http";
import { useNavigate } from "react-router-dom";
import routes from "../../data/routes";

const Info = () => {
    const { recipe } = useContext(AppContext);
    const navigate = useNavigate();

    const [analyzedInstructions, getAnalyzedInstructions] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const id = window.location.href.split('/').pop();
            const instructions = await getRequest(`/recipes/${id}/analyzedInstructions`);
            getAnalyzedInstructions(instructions[0].steps);

            const response = await getRequest(`/recipes/${id}/ingredientWidget.json`);
            setIngredients(response.ingredients);
        }
            
        getData();
    }, []);

    const routeToSearch = () => {
        navigate(routes.search);
    }

    console.log(analyzedInstructions)

    return (
        <div className={styles.info}>
            <button onClick={routeToSearch}>
                <svg viewBox="0 -50 588 588">
                    <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507 "></polygon>
                </svg>
            </button>
            {/* <h1 className={styles.name}>{recipe.title}</h1> */}
            {/* <Ingredients ingredients={ingredients} recipe={recipe}/> */}
            <Instructions instructions={analyzedInstructions}/>
            <Nutrition recipe={recipe}/>
        </div>
    )
}

export default Info;