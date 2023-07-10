import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { postRequest } from "../../helpers/http";

import styles from "./Signup.module.scss";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    users,
    setUsers,
    username,
    setUsername,
    email,
    setEmail,
    setLoggedIn,
    favorites,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const saveUsersToLocalStorage = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const userExists = users.some(
      (user) => user.username === username || user.email === email
    );

    if (userExists) {
      alert("Username or email already exists");
    } else {
      const userData = await postRequest("users/connect", {
        username: username,
        email: email,
      });

      const newUser = {
        username,
        email,
        userData,
        favorites,
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      saveUsersToLocalStorage(updatedUsers);

      setLoggedIn(true);

      navigate("/home");
    }
  };

  return (
    <div className={styles.signup}>
      <h2>SIGN UP</h2>
      <form className={styles.input} onSubmit={handleSignup}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          spellCheck={false}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          spellCheck={false}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <button type="submit">SIGN UP</button>
      </form>
      <div>
        Already have an account?<a href="/login">LOG IN</a>
      </div>
    </div>
  );
};

export default Signup;
