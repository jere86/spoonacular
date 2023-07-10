import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppContextProvider(Component) {
  return function Context(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [recipe, setRecipe] = useState();
    const [recipesData, setRecipesData] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const getUsersFromLocalStorage = () => {
      const storedUsers = localStorage.getItem("users");
      return storedUsers ? JSON.parse(storedUsers) : [];
    };

    const [users, setUsers] = useState(getUsersFromLocalStorage());
    console.log(users);

    return (
      <AppContext.Provider
        value={{
          recipe,
          setRecipe,
          favorites,
          setFavorites,
          recipesData,
          setRecipesData,
          users,
          setUsers,
          username,
          setUsername,
          email,
          setEmail,
          loggedIn,
          setLoggedIn,
        }}
      >
        <Component {...props} />
      </AppContext.Provider>
    );
  };
}
