export default function Recipes({recipe}) {
    return (
        <div className="recipe">
            <h1>{recipe.title}</h1>
            <img src={recipe.image} alt="meal" />
        </div>
    )
}