import styles from './RecipesList.module.scss'

import Recipe from "../Recipe/Recipe"

const RecipesList = ({recipesData}) => {
    
    return (
        <main>
            <div className={styles.recipes}>
                {recipesData.results.map((recipe) => {
                    return <Recipe key={recipe.id} recipe={recipe} />
                })}
            </div>  
        </main>
    )
}

export default RecipesList;
