import Recipe from "../Recipe/Recipe"

import styles from './RecipesList.module.scss'

const RecipesList = ({recipesData}) => {
    return (
        <main>
            <div className={styles.recipes}>
                {recipesData.map((recipe) => {
                    return <Recipe key={recipe.id} recipe={recipe} />
                })}
            </div>  
        </main>
    )
}

export default RecipesList;
