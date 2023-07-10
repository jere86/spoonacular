import { createContext, useEffect, useState } from "react";
import { saveUsersToLocalStorage } from "../helpers/users";

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
    // console.log(users);

    const addFavoriteToCurrentUser = (favorite) => {
      setUsers(prevUsers => ([
        ...prevUsers.map(user => {
          if(user.username === username) {
            return {
              ...user,
              favorites: [...user.favorites, favorite] // tu jos treba filtrirat da se ne dodaju duplikati, tj hendlat brisanje
            }
          } else {
            return {
              ...user
            }
          }
        })
      ]))
    }

    const getCurrentUserFavorites = () => {
      return users.find(user => user.username === username)?.favorites;
    }
    
    useEffect(() => {
      saveUsersToLocalStorage(users)
    }, [users])

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
          addFavoriteToCurrentUser,
          getCurrentUserFavorites
        }}
      >
        <Component {...props} />
      </AppContext.Provider>
    );
  };
}
