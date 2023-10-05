import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export function AppContextProvider(Component) {
  return function Context(props) {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [recipesData, setRecipesData] = useState(null);

    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err.toJSON());
      }
    };

    useEffect(() => {
      getUsers();
    }, []);

    const currentUser = loggedIn
      ? users.find((user) => user.username === username)
      : null;

    console.log(users, currentUser);

    return (
      <AppContext.Provider
        value={{
          users,
          username,
          setUsername,
          email,
          setEmail,
          recipesData,
          setRecipesData,
          loggedIn,
          setLoggedIn,
          currentUser,
          getUsers,
        }}
      >
        <Component {...props} />
      </AppContext.Provider>
    );
  };
}
