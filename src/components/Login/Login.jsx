import { useContext } from "react";
import { AppContext } from "../../context/appContext";

import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { users, username, setUsername, email, setEmail, setLoggedIn } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (user) => user.username === username && user.email === email
    );

    if (user) {
      setLoggedIn(true);
      navigate("/home");
    } else {
      alert("Invalid username or email");
    }
  };

  // const handleLogout = () => {
  //   setLoggedIn(false);

  //   setUsername("");
  //   setEmail("");
  // };
  return (
    <div className={styles.login}>
      <h2>LOG IN</h2>
      <form className={styles.input} onSubmit={handleLogin}>
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
        <button type="submit">LOG IN</button>
      </form>
    </div>
  );
};

export default Login;
