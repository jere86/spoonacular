import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { postRequest } from "../../helpers/http";

import styles from "./Signup.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const { users, username, setUsername, email, setEmail, setLoggedIn } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const userExists = users.some(
      (user) => user.username === username || user.email === email
    );

    if (userExists) {
      alert("Username or email already exists");
    } else {
      const userData = await postRequest("users/connect", "?", {
        username: username,
        email: email,
      });

      await axios.post("spoonacular-api.vercel.app/users", {
        username: username,
        email: email,
        userData: userData,
        favorites: [],
        shopingLists: [],
        images: [],
      });

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
    </div>
  );
};

export default Signup;
