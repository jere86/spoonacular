import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppContextProvider(Component) {
  return function Context(props) {
    const [recipe, setRecipe] = useState();
    const [recipesData, setRecipesData] = useState(null);
    const [favorites, setFavorites] = useState([]);

    
    console.log(favorites);

    return (
      <AppContext.Provider
        value={{
            recipe,
            setRecipe,
            favorites,
            setFavorites,
            recipesData,
            setRecipesData
        }}
      >
        <Component {...props} />
      </AppContext.Provider>
    );
  };
}
