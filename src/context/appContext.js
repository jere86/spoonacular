import { createContext, useEffect, useState } from "react";
import {
  getUsersFromLocalStorage,
  saveUsersToLocalStorage,
} from "../helpers/users";

export const AppContext = createContext();

export function AppContextProvider(Component) {
  return function Context(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [recipesData, setRecipesData] = useState(null);
    const [users, setUsers] = useState(getUsersFromLocalStorage());
    const [shopingListData, setShopingListData] = useState();

    useEffect(() => {
      saveUsersToLocalStorage(users);
    }, [users]);

    const currentUser = loggedIn
      ? users.find((user) => user.username === username)
      : null;

    return (
      <AppContext.Provider
        value={{
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
          currentUser,
          shopingListData,
          setShopingListData,
        }}
      >
        <Component {...props} />
      </AppContext.Provider>
    );
  };
}
