import Recipe from "./Recipe"

export default function RecipesList({recipesData}) {
    return (
        <main>
            <div className="recipes">
                {recipesData.map((recipe) => {
                    return <Recipe key={recipe.id} recipe={recipe} />
                })}
            </div>  
        </main>
    )
}